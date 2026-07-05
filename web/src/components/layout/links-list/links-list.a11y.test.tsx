import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LinksList } from "@/components/layout/links-list/links-list.tsx";
import type { Link } from "@/types/link.ts";

const invalidateQueriesSpy = vi.fn();
const mutateSpy = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: invalidateQueriesSpy,
  }),
  useMutation: () => ({
    mutate: mutateSpy,
    isPending: false,
  }),
}));

const linksFixture: Link[] = [
  {
    id: "1",
    originalUrl: "https://example.com",
    shortUrl: "example",
    accessCount: 14,
    createdAt: "2026-04-02T10:00:00.000Z",
  },
];

describe("LinksList a11y", () => {
  beforeEach(() => {
    invalidateQueriesSpy.mockReset();
    mutateSpy.mockReset();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("provides accessible names for main actions", () => {
    render(React.createElement(LinksList, { links: linksFixture }));

    expect(screen.getByRole("list", { name: /meus links encurtados/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /abrir link encurtado brev\.ly\/example/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /copiar link encurtado brev\.ly\/example/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /deletar link brev\.ly\/example/i,
      }),
    ).toBeInTheDocument();
  });

  it("has no accessibility violations with dialog closed", async () => {
    const { container } = render(React.createElement(LinksList, { links: linksFixture }));

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("has no accessibility violations when delete dialog is open", async () => {
    const user = userEvent.setup();
    const { container } = render(React.createElement(LinksList, { links: linksFixture }));

    await user.click(
      screen.getByRole("button", {
        name: /deletar link brev\.ly\/example/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alertdialog", { name: /deletar link/i })).toBeInTheDocument();
    });

    const results = await axe(container.ownerDocument.body);
    expect(results.violations).toHaveLength(0);
  });
});
