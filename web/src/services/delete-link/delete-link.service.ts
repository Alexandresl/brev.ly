import { api } from "@/services/api-client.ts";

export async function deleteLinkService(id: string): Promise<void> {
  await api.delete(`/links/${id}`);
}
