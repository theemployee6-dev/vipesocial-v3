import { serve } from "inngest/next";
import { inngest } from "@/infrastructure/inngest/InngestClient";
import { processAnalysisWorkflow } from "@/infrastructure/inngest/functions/ProcessAnalysisWorkflow";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processAnalysisWorkflow],
});
