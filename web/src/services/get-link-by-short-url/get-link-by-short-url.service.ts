import { api } from "@/services/api-client.ts";

export type GetLinkByShortUrlResponse = {
  originalUrl: string;
};

export async function getLinkByShortUrlService(
  shortUrl: string
): Promise<GetLinkByShortUrlResponse> {
  const { data } = await api.get<GetLinkByShortUrlResponse>(
    `/links/${shortUrl}`
  );
  return data;
}
