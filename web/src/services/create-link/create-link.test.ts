import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLinkService } from "./create-link.service.ts";
import { api } from "@/services/api-client.ts";

vi.mock("@/services/api-client.ts", () => ({
  api: {
    post: vi.fn(),
  },
}));

const createdLink = {
  id: "0195f2d7-6b7e-7d4d-9a1b-8d6c2f3e4a5b",
  originalUrl: "https://example.com",
  shortUrl: "example",
  accessCount: 0,
  createdAt: "2026-03-30T00:00:00.000Z",
};


describe("createLinkService", () => {
  const mockedPost = vi.mocked(api.post);

  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("creates a link when API responds with a valid payload", async () => {
    const input = {
      originalUrl: "https://example.com",
      shortUrl: "example",
    };
  
    mockedPost.mockResolvedValueOnce({
      data: createdLink,
    });
  
    const result = await createLinkService(input);
  
    expect(result).toEqual({
      ...createdLink
    });
  
    expect(mockedPost).toHaveBeenCalledWith("/links", input);
  });

  it("propagates API errors", async () => {
    const input = {
      originalUrl: "https://example.com",
      shortUrl: "example",
    };

    mockedPost.mockRejectedValueOnce(new Error("Network error"));

    await expect(createLinkService(input)).rejects.toThrow("Network error");
  });
});
