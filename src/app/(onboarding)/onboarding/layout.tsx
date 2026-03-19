import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Configurando sua conta - VipeSocial",
  description: "Configurando seu perfil para receber análises personalizadas",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#080810]">{children}</div>;
}
