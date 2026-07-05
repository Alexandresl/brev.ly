import { z } from "zod";
import { api } from "@/services/api-client.ts";

const exportLinksCsvResponseSchema = z.object({
  fileKey: z.string(),
  fileUrl: z.string().url(),
});

export type ExportLinksCsvResponse = z.infer<typeof exportLinksCsvResponseSchema>;

export async function exportLinksCsvService(): Promise<ExportLinksCsvResponse> {
  const { data } = await api.post("/links/export");
  return exportLinksCsvResponseSchema.parse(data);
}
