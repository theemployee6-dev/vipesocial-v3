import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/infrastructure/storage/uploadthing";

// Essa rota é o endpoint que o Uploadthing usa para
// gerenciar os uploads. Ela precisa existir para o
// componente de upload funcionar no frontend.
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
