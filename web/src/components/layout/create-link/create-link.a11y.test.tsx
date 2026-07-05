import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { CreateLink } from "@/components/layout/create-link/create-link.tsx";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
  useMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("CreateLink a11y", () => {
  it("has no a11y violations and links errors to fields", async () => {
    const user = userEvent.setup();
    const { container } = render(<CreateLink />);

    const originalInput = screen.getByRole("textbox", { name: /original link/i });
    const shortInput = screen.getByRole("textbox", { name: /short link/i });

    expect(originalInput).toBeInTheDocument();
    expect(shortInput).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save link/i }));

    const originalError = await screen.findByText(/insira um url válido/i);
    const shortError = await screen.findByText(/pelo menos 3 caracteres/i);

    expect(originalInput).toHaveAttribute("aria-invalid", "true");
    expect(shortInput).toHaveAttribute("aria-invalid", "true");
    expect(originalInput).toHaveAttribute("aria-describedby", "original-url-error");
    expect(shortInput).toHaveAttribute("aria-describedby", "short-url-error");
    expect(originalError).toHaveAttribute("id", "original-url-error");
    expect(shortError).toHaveAttribute("id", "short-url-error");

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
