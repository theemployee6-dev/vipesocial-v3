/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/infrastructure/stripe/StripeClient";
import { createServiceSupabaseClient } from "@/infrastructure/supabase/server";
import { PLAN_LIMITS } from "@/infrastructure/stripe/StripeClient";

// CRÍTICO: desabilita o body parser padrão do Next.js
// O Stripe precisa do body raw para verificar a assinatura
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;

  try {
    // Verifica que o webhook veio realmente do Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature inválida:", error);
    return NextResponse.json(
      { error: "Webhook signature inválida" },
      { status: 400 },
    );
  }

  // Usa service role para bypassing do RLS
  const supabase = createServiceSupabaseClient();

  try {
    switch (event.type) {
      // Pagamento confirmado — ativa a assinatura
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan;

        if (!userId || !plan) break;

        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3;

        await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: session.subscription,
            plan: plan,
            status: "active",
            analyses_limit: limit,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`Assinatura ativada: user ${userId}, plano ${plan}`);
        break;
      }

      // Assinatura atualizada — troca de plano ou renovação
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const plan = subscription.metadata?.plan || "starter";
        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3;

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            plan: plan,
            analyses_limit: limit,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            // Reseta o contador de análises no início de cada período
            analyses_used_this_period: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }

      // Assinatura cancelada
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            plan: "starter",
            analyses_limit: PLAN_LIMITS.trialing,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }

      // Pagamento falhou
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (subscription) {
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", subscription.user_id);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar evento" },
      { status: 500 },
    );
  }
}
