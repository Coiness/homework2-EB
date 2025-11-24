import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NavigationMenu } from "./NavigationMenu";

// Mock next/navigation 因为 SearchBar 用到了它
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("NavigationMenu", () => {
  it("renders logo, search bar and cart link", () => {
    render(<NavigationMenu />);

    // 1. 检查 Logo
    expect(screen.getByText("MyShop")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /myshop/i })).toHaveAttribute(
      "href",
      "/"
    );

    // 2. 检查 SearchBar (通过 placeholder 查找)
    expect(screen.getByPlaceholderText("搜索商品...")).toBeInTheDocument();

    // 3. 检查购物车链接 (通过 href 查找，因为图标可能没有文本)
    // 我们查找包含 href="/cart" 的链接
    const links = screen.getAllByRole("link");
    const cartLink = links.find(
      (link) => link.getAttribute("href") === "/cart"
    );
    expect(cartLink).toBeInTheDocument();
  });
});
