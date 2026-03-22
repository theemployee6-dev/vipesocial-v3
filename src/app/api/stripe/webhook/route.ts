/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from "next/server";
import { stripe, PLAN_LIMITS } from "@/infrastructure/stripe/StripeClient";
import { createServiceSupabaseClient } from "@/infrastructure/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;

  try {
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

  const supabase = createServiceSupabaseClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan;

        if (!userId || !plan) {
          console.error("Metadata ausente no checkout.session.completed");
          break;
        }

        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3;

        // Busca o período atual da subscription no Stripe
        // para salvar as datas corretas
        let periodStart = null;
        let periodEnd = null;

        if (session.subscription) {
          try {
            const stripeSubscription = (await stripe.subscriptions.retrieve(
              session.subscription,
            )) as any; // cast para any por mudança de tipos no SDK

            periodStart = new Date(
              stripeSubscription.current_period_start * 1000,
            ).toISOString();
            periodEnd = new Date(
              stripeSubscription.current_period_end * 1000,
            ).toISOString();
          } catch (err) {
            console.error("Erro ao buscar subscription no Stripe:", err);
          }
        }

        const { error } = await supabase
          .from("subscriptions")
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            status: "active",
            analyses_limit: limit,
            analyses_used_this_period: 0,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) {
          console.error("Erro ao atualizar subscription:", error);
        } else {
          console.log(`✅ Assinatura ativada: user ${userId}, plano ${plan}`);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) {
          // Tenta encontrar pelo customer_id
          const { data } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", subscription.customer)
            .single();

          if (!data) {
            console.error(
              "Usuário não encontrado para customer:",
              subscription.customer,
            );
            break;
          }

          const plan = subscription.metadata?.plan || "starter";
          const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3;

          await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              plan,
              analyses_limit: limit,
              current_period_start: new Date(
                subscription.current_period_start * 1000,
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000,
              ).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              analyses_used_this_period: 0,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", data.user_id);

          break;
        }

        const plan = subscription.metadata?.plan || "starter";
        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3;

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            plan,
            analyses_limit: limit,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            analyses_used_this_period: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        // Tenta pelo metadata primeiro, depois pelo customer_id
        let userId = subscription.metadata?.supabase_user_id;

        if (!userId) {
          const { data } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", subscription.customer)
            .single();

          userId = data?.user_id;
        }

        if (!userId) {
          console.error("Usuário não encontrado para deletar subscription");
          break;
        }

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

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;

        const { data } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", invoice.customer)
          .single();

        if (data) {
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", data.user_id);
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
