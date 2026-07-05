import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    <div data-testid="links-list">Links: {links.length}</div>
  ),
}));

const linksFixture: Link[] = [
  {
    id: "1",
    originalUrl: "https://example.com",
    shortUrl: "example",
    accessCount: 12,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
];

describe("MyLinks", () => {
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

  beforeEach(() => {
    useLinksMock.mockReset();
  });

  it("shows loading state while links are loading", () => {
    useLinksMock.mockReturnValue({
      links: [],
      isLoading: true,
      error: null,
    });

    renderWithQueryClient(<MyLinks />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("shows error message when links request fails", () => {
    useLinksMock.mockReturnValue({
      links: [],
      isLoading: false,
      error: "Falha ao carregar os links",
    });

    renderWithQueryClient(<MyLinks />);

    expect(screen.getByText(/falha ao carregar os links/i)).toBeInTheDocument();
  });

  it("shows empty state and keeps CSV download disabled when there are no links", () => {
    useLinksMock.mockReturnValue({
      links: [],
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<MyLinks />);

    expect(screen.getByText(/ainda não existem links cadastrados/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeDisabled();
  });

  it("renders list and enables CSV download when links exist", () => {
    useLinksMock.mockReturnValue({
      links: linksFixture,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<MyLinks />);

    expect(screen.getByTestId("links-list")).toHaveTextContent("Links: 1");
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeEnabled();
  });
});
