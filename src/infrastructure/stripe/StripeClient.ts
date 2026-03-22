import Stripe from "stripe";

// Cliente do Stripe para uso no servidor.
// Nunca expor a secret key no frontend.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// Price IDs dos planos
export const STRIPE_PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
} as const;

// Limites de análises por plano
export const PLAN_LIMITS = {
  starter: 3,
  pro: 999999, // ilimitado
  trialing: 1, // 1 análise grátis no trial
} as const;
