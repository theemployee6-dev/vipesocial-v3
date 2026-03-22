import { NextResponse, type NextRequest } from "next/server";
import { stripe, STRIPE_PRICES } from "@/infrastructure/stripe/StripeClient";
import { createServerSupabaseClient } from "@/infrastructure/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !["starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    // Busca ou cria o customer no Stripe
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Se não tem customer no Stripe ainda, cria
    if (!customerId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const customer = await stripe.customers.create({
        email: user.email!,
        name: profile?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;

      // Salva o customer ID no banco
      await supabase
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    // Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: STRIPE_PRICES[plan as "starter" | "pro"],
          quantity: 1,
        },
      ],
      // Redireciona para o dashboard após pagamento
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      // Redireciona de volta para preços se cancelar
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/#precos`,
      // Passa o user_id para o webhook identificar quem pagou
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
      // Localização brasileira
      locale: "pt-BR",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: "Erro ao iniciar pagamento" },
      { status: 500 },
    );
  }
}
