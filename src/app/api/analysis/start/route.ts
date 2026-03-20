import { NextResponse, type NextRequest } from "next/server";
import { inngest } from "@/infrastructure/inngest/InngestClient";
import { createServerSupabaseClient } from "@/infrastructure/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verifica autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { analysisId } = await request.json();

    if (!analysisId) {
      return NextResponse.json(
        { error: "analysisId é obrigatório" },
        { status: 400 },
      );
    }

    // Dispara o evento para o Inngest
    await inngest.send({
      name: "vipesocial/analysis.started",
      data: { analysisId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao iniciar análise:", error);
    return NextResponse.json(
      { error: "Erro ao iniciar análise" },
      { status: 500 },
    );
  }
}
