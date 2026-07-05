import { api } from "@/services/api-client.ts";
import type { Link } from "@/types/link.ts";

export type CreateLinkInput = {
  originalUrl: string;
  shortUrl: string;
};

export async function createLinkService(input: CreateLinkInput): Promise<Link> {
  const { data } = await api.post<Link>("/links", input);
  return data;
}
