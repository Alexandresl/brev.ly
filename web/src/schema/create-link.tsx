import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .url("Insira um URL válido (ex: https://www.exemplo.com)"),
  shortUrl: z
    .string()
    .transform((val) => val.replace(/^brev\.ly\//, ""))
    .pipe(
      z
        .string()
        .min(3, "O link encurtado deve ter pelo menos 3 caracteres")
        .max(50, "O link encurtado deve ter no máximo 50 caracteres")
        .regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, _ e -")
    ),
});
