import z from "zod";

// export const metricasSchema = z.object({
//   views: z
//     .number({ error: "Digite o número de views" })
//     .min(0, "Views não pode ser negativo"),
//   likes: z
//     .number({ error: "Digite o número de likes" })
//     .min(0, "Likes não pode ser negativo"),
//   comments: z
//     .number({ error: "Digite o número de comentários" })
//     .min(0, "Comentários não pode ser negativo"),
//   shares: z
//     .number({ error: "Digite o número de compartilhamentos" })
//     .min(0, "Compartilhamentos não pode ser negativo"),
//   saves: z
//     .number({ error: "Digite o número de salvamentos" })
//     .min(0, "Salvamentos não pode ser negativo"),
// });

// export type MetricasFormData = z.infer<typeof metricasSchema>;

export const metricasSchema = z.object({
  views: z
    .number({ error: "Digite o número de views" })
    .min(0, { error: "Views não pode ser negativo" }),
  likes: z
    .number({ error: "Digite o número de likes" })
    .min(0, { error: "Likes não pode ser negativo" }),
  comments: z
    .number({ error: "Digite o número de comentários" })
    .min(0, { error: "Comentários não pode ser negativo" }),
  shares: z
    .number({ error: "Digite o número de compartilhamentos" })
    .min(0, { error: "Compartilhamentos não pode ser negativo" }),
  saves: z
    .number({ error: "Digite o número de salvamentos" })
    .min(0, { error: "Salvamentos não pode ser negativo" }),
});

export type MetricasFormData = z.infer<typeof metricasSchema>;
