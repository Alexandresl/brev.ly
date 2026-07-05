import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/header/header.tsx";

const setThemeSpy = vi.fn();
const themeState = {
  theme: "light" as "light" | "dark" | "system",
};

vi.mock("@/components/theme-provider.tsx", () => ({
  useTheme: () => ({
    theme: themeState.theme,
    setTheme: setThemeSpy,
  }),
}));

describe("Header a11y", () => {
  beforeEach(() => {
    setThemeSpy.mockReset();
    themeState.theme = "light";
  });

  it("exposes an accessible name for the logo home link", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /ir para a página inicial/i }),
    ).toHaveAttribute("href", "/");
  });

  it("keeps theme toggle button accessible and interactive", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole("button", { name: /alternar tema/i });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    expect(setThemeSpy).toHaveBeenCalledWith("dark");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
