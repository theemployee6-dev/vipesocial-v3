import { NextResponse, type NextRequest } from "next/server";
import { inngest } from "@/infrastructure/inngest/InngestClient";
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

    const { analysisId, confirmedNiche } = await request.json();

    if (!analysisId || !confirmedNiche) {
      return NextResponse.json(
        { error: "analysisId e confirmedNiche são obrigatórios" },
        { status: 400 },
      );
    }

    // Dispara o evento para o Inngest retomar o workflow
    await inngest.send({
      name: "vipesocial/niche.confirmed",
      data: {
        analysisId,
        confirmedNiche,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao confirmar nicho:", error);
    return NextResponse.json(
      { error: "Erro ao confirmar nicho" },
      { status: 500 },
    );
  }
}
