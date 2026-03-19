import { serve } from "inngest/next";
import { inngest } from "@/infrastructure/inngest/InngestClient";

// Essa rota é o endpoint que o Inngest usa para
// se comunicar com o Next.js.
// Por enquanto sem functions — vamos adicionar conforme criamos.

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [],
});
