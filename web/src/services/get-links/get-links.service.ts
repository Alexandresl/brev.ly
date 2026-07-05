import type { Link } from "@/types/link.ts";
import { api } from "@/services/api-client.ts";

export type GetLinksResponse = {
  links: Link[];
  total: number;
  page: number;
  pageSize: number;
};

export type GetLinksInput = {
  page?: number;
  pageSize?: number;
};

export async function getLinksService(
  input: GetLinksInput = {}
): Promise<GetLinksResponse> {
  const { data } = await api.get<GetLinksResponse>("/links", {
    params: {
      page: input.page,
      pageSize: input.pageSize,
    },
  });

  if (!Array.isArray(data.links)) {
    throw new Error("Invalid get-links response");
  }

  return data;
}
