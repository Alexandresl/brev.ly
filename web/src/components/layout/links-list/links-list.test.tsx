import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LinksList } from "@/components/layout/links-list/links-list.tsx";
import type { Link } from "@/types/link.ts";

const invalidateQueriesSpy = vi.fn();
const mutateSpy = vi.fn();

const mutationState = {
  isPending: false,
};
const { toastSuccessSpy, toastErrorSpy } = vi.hoisted(() => ({
  toastSuccessSpy: vi.fn(),
  toastErrorSpy: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: invalidateQueriesSpy,
  }),
  useMutation: (options: { onSuccess?: () => void }) => ({
    mutate: (id: string) => {
      mutateSpy(id);
      options.onSuccess?.();
    },
    isPending: mutationState.isPending,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessSpy,
    error: toastErrorSpy,
  },
}));

const linksFixture: Link[] = [
  {
    id: "1",
    originalUrl: "https://example.com/first",
    shortUrl: "first",
    accessCount: 2,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "2",
    originalUrl: "https://example.com/second",
    shortUrl: "second",
    accessCount: 9,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
];

describe("LinksList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    invalidateQueriesSpy.mockReset();
    mutateSpy.mockReset();
    mutationState.isPending = false;
    toastSuccessSpy.mockReset();
    toastErrorSpy.mockReset();
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  it("renders all links with original url and views count", () => {
    render(React.createElement(LinksList, { links: linksFixture }));

    expect(
      screen.getByRole("button", {
        name: /abrir link encurtado brev\.ly\/first/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /abrir link encurtado brev\.ly\/second/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("https://example.com/first")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/second")).toBeInTheDocument();
    expect(screen.getByText("2 acessos")).toBeInTheDocument();
    expect(screen.getByText("9 acessos")).toBeInTheDocument();
  });

  it("opens a new tab when user clicks the short url button", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open");

    render(React.createElement(LinksList, { links: [linksFixture[0]] }));

    await user.click(
      screen.getByRole("button", {
        name: /abrir link encurtado brev\.ly\/first/i,
      }),
    );

    expect(openSpy).toHaveBeenCalledWith(
      "/first",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("shows feedback when user clicks copy shortened link button", async () => {
    const user = userEvent.setup();

    render(React.createElement(LinksList, { links: [linksFixture[0]] }));

    await user.click(
      screen.getByRole("button", {
        name: /copiar link encurtado brev\.ly\/first/i,
      }),
    );

    expect(toastSuccessSpy.mock.calls.length + toastErrorSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it("calls mutation with link id after confirming deletion and invalidates links query", async () => {
    const user = userEvent.setup();
    render(React.createElement(LinksList, { links: [linksFixture[0]] }));

    await user.click(
      screen.getByRole("button", {
        name: /deletar link brev\.ly\/first/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: /^deletar$/i }));

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith("1");
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["links"] });
  });

  it("disables delete action while deletion is pending", () => {
    mutationState.isPending = true;

    render(React.createElement(LinksList, { links: [linksFixture[0]] }));

    expect(
      screen.getByRole("button", {
        name: /deletar link brev\.ly\/first/i,
      }),
    ).toBeDisabled();
  });
});
