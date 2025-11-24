import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// We'll mock next/navigation hooks used by our filters
let mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = "/products";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => mockPathname,
}));

import { CheckboxFilter } from "./CheckoutboxFilter";
import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./priceRangeFilter";

describe("Filter Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockPush = vi.fn();
  });

  it("CheckboxFilter reads url and toggles tags param", () => {
    // start with ?tags=hot
    mockSearchParams.set("tags", "hot");

    render(
      <CheckboxFilter
        title="标签"
        paramKey="tags"
        options={[
          { label: "热销", value: "hot" },
          { label: "新品", value: "new" },
        ]}
      />
    );

    // hot should be checked, new unchecked
    const hotCheckbox = screen.getByLabelText("热销") as HTMLInputElement;
    const newCheckbox = screen.getByLabelText("新品") as HTMLInputElement;

    expect(hotCheckbox).toBeInTheDocument();
    // Our Checkbox is a Radix control (not a native <input>), so use accessibility matchers
    expect(hotCheckbox).toBeChecked();
    expect(newCheckbox).not.toBeChecked();

    // click on new checkbox to add 'new'
    fireEvent.click(newCheckbox);

    // Should push updated URL containing tags=hot,new
    expect(mockPush).toHaveBeenCalled();
    // router.push will URL-encode params (comma -> %2C), so decode before asserting
    const called = decodeURIComponent(mockPush.mock.calls[0][0]);
    expect(called).toContain("tags=hot,new");
  });

  it("CategoryFilter sets category param and resets page", () => {
    render(<CategoryFilter categories={[{ id: "clothes", name: "服饰" }]} />);

    const btn = screen.getByText("服饰");
    fireEvent.click(btn);

    expect(mockPush).toHaveBeenCalled();
    const called = mockPush.mock.calls[0][0];
    expect(called).toContain("category=clothes");
    expect(called).toContain("page=1");
  });

  it("PriceRangeFilter updates min/max and pushes url", () => {
    render(<PriceRangeFilter />);

    const minInput = screen.getByPlaceholderText("¥ 最低") as HTMLInputElement;
    const maxInput = screen.getByPlaceholderText("¥ 最高") as HTMLInputElement;
    const btn = screen.getByRole("button", { name: /应用/ });

    fireEvent.change(minInput, { target: { value: "50" } });
    fireEvent.change(maxInput, { target: { value: "200" } });
    fireEvent.click(btn);

    expect(mockPush).toHaveBeenCalled();
    const called = mockPush.mock.calls[0][0];
    expect(called).toContain("minPrice=50");
    expect(called).toContain("maxPrice=200");
  });
});
