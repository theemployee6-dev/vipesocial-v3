import { z } from "zod";

// ============================================================
// SCHEMA DE LOGIN
// Valida os campos do formulário de login antes de
// qualquer chamada ao Supabase. Se a validação falhar,
// o erro aparece na tela sem precisar fazer requisição.
// ============================================================
export const loginSchema = z.object({
  email: z
    .email("Digite um email válido")
    // Garante que o campo não está vazio
    .min(1, "Email é obrigatório"),

  password: z
    .string()
    .min(1, "Senha é obrigatória")
    // Mínimo de 6 caracteres — mesmo mínimo do Supabase Auth
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
});

// ============================================================
// SCHEMA DE CADASTRO
// Mais complexo que o login porque tem confirmação de senha
// e validação de nome.
// ============================================================
export const cadastroSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nome é obrigatório")
      // Mínimo de 3 caracteres para evitar nomes inválidos
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      // Máximo razoável para o banco de dados
      .max(100, "Nome muito longo"),

    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Digite um email válido"),

    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      // Garante pelo menos uma letra e um número
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Senha deve conter letras e números"),

    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  // O .refine é usado quando a validação depende de
  // mais de um campo ao mesmo tempo.
  // Aqui verificamos se senha e confirmação são iguais.
  .refine((data) => data.password === data.confirmPassword, {
    // Mensagem de erro que vai aparecer
    message: "As senhas não coincidem",
    // Em qual campo o erro vai aparecer
    path: ["confirmPassword"],
  });

// ============================================================
// TIPOS INFERIDOS DOS SCHEMAS
// Em vez de criar interfaces TypeScript manualmente,
// inferimos os tipos diretamente dos schemas do Zod.
// Isso garante que os tipos estão sempre sincronizados
// com as regras de validação — se a regra muda,
// o tipo muda automaticamente.
// ============================================================
export type LoginFormData = z.infer<typeof loginSchema>;
export type CadastroFormData = z.infer<typeof cadastroSchema>;
