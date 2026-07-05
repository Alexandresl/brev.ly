import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { MyLinks } from "@/components/layout/my-links/my-links.tsx";
import type { Link } from "@/types/link.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

const useLinksMock = vi.fn();

vi.mock("@/hooks/use-links.ts", () => ({
  useLinks: () => useLinksMock(),
}));

vi.mock("@/components/layout/links-list/links-list.tsx", () => ({
  LinksList: ({ links }: { links: Link[] }) => (
    <ul aria-label="links list">
      {links.map((link) => (
        <li key={link.id}>{link.shortUrl}</li>
      ))}
    </ul>
  ),
}));

describe("MyLinks a11y", () => {
  const renderWithQueryClient = (ui: ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  };

  it("has no accessibility violations in empty state", async () => {
    useLinksMock.mockReturnValue({
      links: [],
      isLoading: false,
      error: null,
    });

    const { container } = renderWithQueryClient(<MyLinks />);

    expect(screen.getByText(/meus links/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeDisabled();

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("has no accessibility violations when links are present", async () => {
    useLinksMock.mockReturnValue({
      links: [
        {
          id: "1",
          originalUrl: "https://example.com",
          shortUrl: "example",
          accessCount: 10,
          createdAt: "2026-04-01T10:00:00.000Z",
        },
      ],
      isLoading: false,
      error: null,
    });

    const { container } = renderWithQueryClient(<MyLinks />);

    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeEnabled();
    expect(screen.getByRole("list", { name: /links list/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
