import { Inngest } from "inngest";

// Esse cliente é usado para enviar eventos e definir functions.
// O id identifica sua aplicação no Inngest.

export const inngest = new Inngest({
  id: "vipesocial",
});
