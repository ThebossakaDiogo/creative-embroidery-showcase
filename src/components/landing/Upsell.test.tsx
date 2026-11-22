import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Landing } from "./Landing";

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
  });
});

describe("purchase upgrade flow", () => {
  it("opens the upgrade dialog from every purchase CTA and closes with Escape", async () => {
    const { container } = render(<Landing />);
    const ctas = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-purchase-cta]"));
    expect(ctas).toHaveLength(5);

    for (const cta of ctas) {
      fireEvent.click(cta);
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeVisible();
      fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    }
  });

  it("deters image context menus and dragging without blocking page text", () => {
    const { container } = render(<Landing />);
    const image = container.querySelector("img");
    expect(image).not.toBeNull();

    const imageMenu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    image!.dispatchEvent(imageMenu);
    expect(imageMenu.defaultPrevented).toBe(true);

    const imageDrag = new Event("dragstart", { bubbles: true, cancelable: true });
    image!.dispatchEvent(imageDrag);
    expect(imageDrag.defaultPrevented).toBe(true);

    const pageMenu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    container.querySelector("main")!.dispatchEvent(pageMenu);
    expect(pageMenu.defaultPrevented).toBe(false);
  });

  it("keeps the essential refusal usable while both checkout destinations are empty", async () => {
    const track = vi.fn();
    Object.defineProperty(window, "__lovableEvents", { writable: true, value: { track } });
    const { container } = render(<Landing />);
    const firstCta = container.querySelector<HTMLButtonElement>("[data-purchase-cta]");
    expect(firstCta).not.toBeNull();
    fireEvent.click(firstCta!);

    const dialog = await screen.findByRole("dialog");
    expect(dialog.querySelector("a[href]")).toBeNull();
    expect(screen.getByRole("button", { name: /Oui, je veux l'offre Premium/ })).toBeDisabled();
    const essential = screen.getByRole("button", { name: /Non merci, je garde mon offre/ });
    expect(essential).toBeEnabled();
    expect(track).toHaveBeenCalledWith("project.upgrade_popup_viewed");

    fireEvent.click(essential);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(track).toHaveBeenCalledWith("project.upgrade_declined", {
      plan: "essential",
      price: 9.9,
    });
  });
});
