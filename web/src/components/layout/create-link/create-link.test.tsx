import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateLink } from "@/components/layout/create-link/create-link.tsx";

const mutationState = {
  isPending: false,
  error: null as Error | null,
};

const mutateSpy = vi.fn();
const invalidateQueriesSpy = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: invalidateQueriesSpy,
  }),
  useMutation: () => ({
    mutate: mutateSpy,
    isPending: mutationState.isPending,
    error: mutationState.error,
  }),
}));

describe("CreateLink", () => {
  beforeEach(() => {
    mutateSpy.mockReset();
    invalidateQueriesSpy.mockReset();
    mutationState.isPending = false;
    mutationState.error = null;
  });

  it("submits valid form data", async () => {
    const user = userEvent.setup();
    render(<CreateLink />);

    await user.type(
      screen.getByRole("textbox", { name: /original link/i }),
      "https://example.com",
    );
    await user.type(
      screen.getByRole("textbox", { name: /short link/i }),
      "my-link",
    );

    await user.click(screen.getByRole("button", { name: /save link/i }));

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({
      originalUrl: "https://example.com",
      shortUrl: "my-link",
    });
  });

  it("shows error when original url is invalid", async () => {
    const user = userEvent.setup();
    render(<CreateLink />);

    await user.type(
      screen.getByRole("textbox", { name: /original link/i }),
      "invalid-url",
    );
    await user.type(
      screen.getByRole("textbox", { name: /short link/i }),
      "my-link",
    );
    await user.click(screen.getByRole("button", { name: /save link/i }));

    expect(
      await screen.findByText(/insira um url válido/i),
    ).toBeInTheDocument();
    expect(mutateSpy).not.toHaveBeenCalled();
  });

  it("shows error when short url is invalid", async () => {
    const user = userEvent.setup();
    render(<CreateLink />);

    await user.type(
      screen.getByRole("textbox", { name: /original link/i }),
      "https://example.com",
    );
    await user.type(
      screen.getByRole("textbox", { name: /short link/i }),
      "ab",
    );
    await user.click(screen.getByRole("button", { name: /save link/i }));

    expect(
      await screen.findByText(/pelo menos 3 caracteres/i),
    ).toBeInTheDocument();
    expect(mutateSpy).not.toHaveBeenCalled();
  });

  it("shows loading state while mutation is pending", () => {
    mutationState.isPending = true;
    const { container } = render(<CreateLink />);

    const saveButton = screen.getByRole("button", { name: /saving/i });
    expect(saveButton).toBeDisabled();
    expect(container.querySelector("form")).toHaveAttribute("aria-busy", "true");
  });
});
