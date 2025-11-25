import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toolbar } from "./Toolbar";
import { DisplaySection } from "./DisplaySection";

const mockProducts = Array.from({ length: 6 }).map((_, i) => ({
  id: `p${i}`,
  name: `Product ${i}`,
  price: 99 + i,
  sales: i * 10,
  image: "https://placehold.co/400x400/png",
  tags: i % 2 === 0 ? ["hot"] : ["new"],
}));

describe("MainContent basic render", () => {
  it("renders toolbar and display grid", () => {
    const onSort = vi.fn();
    render(
      <Toolbar currentSort="default" productCount={6} onSortChange={onSort} />
    );
    expect(screen.getByText("6 条结果")).toBeInTheDocument();
  });

  it("renders product grid and pagination", () => {
    render(
      <DisplaySection
        products={mockProducts}
        layout="grid"
        currentPage={1}
        totalPages={3}
      />
    );
    // should render at least one product name
    expect(screen.getByText("Product 0")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });
});
