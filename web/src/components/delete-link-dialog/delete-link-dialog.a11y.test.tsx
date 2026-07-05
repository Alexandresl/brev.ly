import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { DeleteLinkDialog } from "@/components/delete-link-dialog/delete-link-dialog.tsx";

describe("DeleteLinkDialog a11y", () => {
  it("exposes an accessible trigger label and opens dialog with keyboard", async () => {
    const user = userEvent.setup();

    render(
      <DeleteLinkDialog
        shortUrl="my-link"
        onConfirm={vi.fn()}
      />,
    );

    await user.tab();

    const trigger = screen.getByRole("button", { name: /delete link brev\.ly\/my-link/i });
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(screen.getByRole("alertdialog", { name: /delete link/i })).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it("has no critical accessibility violations when dialog is open", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <DeleteLinkDialog
        shortUrl="my-link"
        onConfirm={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete link brev\.ly\/my-link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alertdialog", { name: /delete link/i })).toBeInTheDocument();
    });

    const results = await axe(container.ownerDocument.body);
    expect(results.violations).toHaveLength(0);
  });

  it("closes with Escape and triggers confirm action", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteLinkDialog
        shortUrl="my-link"
        onConfirm={onConfirm}
      />,
    );

    const trigger = screen.getByRole("button", { name: /delete link brev\.ly\/my-link/i });
    await user.click(trigger);
    expect(screen.getByRole("alertdialog", { name: /delete link/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog", { name: /delete link/i })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
