import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchBar } from "./SearchBar";

// --- 1. Mock next/navigation ---
const mockPush = vi.fn();
// 我们需要一个变量来动态控制 useSearchParams 的返回值
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    // 每个测试前重置 mock 状态
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("renders correctly with empty initial state", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "搜索商品..."
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("");
  });

  it("initializes input value from URL query param", () => {
    // 模拟 URL 中已有 ?query=apple
    mockSearchParams.set("query", "apple");

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "搜索商品..."
    ) as HTMLInputElement;
    expect(input.value).toBe("apple");
  });

  it("updates input value when typing", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      "搜索商品..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "banana" } });

    expect(input.value).toBe("banana");
  });

  it("navigates to correct URL on search button click", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("搜索商品...");
    const button = screen.getByRole("button", { name: /搜索/i });

    // 输入 'phone'
    fireEvent.change(input, { target: { value: "phone" } });
    // 点击搜索
    fireEvent.click(button);

    // 验证 router.push 是否被调用，且参数正确
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/products?query=phone");
  });

  it("navigates to correct URL on Enter key press", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("搜索商品...");

    fireEvent.change(input, { target: { value: "laptop" } });
    // 模拟按下回车
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/products?query=laptop");
  });

  it("preserves existing URL parameters when searching", () => {
    // 模拟 URL 中已有 ?category=shoes&sort=price
    mockSearchParams.set("category", "shoes");
    mockSearchParams.set("sort", "price");

    render(<SearchBar />);

    const input = screen.getByPlaceholderText("搜索商品...");
    const button = screen.getByRole("button", { name: /搜索/i });

    // 输入 'nike'
    fireEvent.change(input, { target: { value: "nike" } });
    fireEvent.click(button);

    // 验证跳转链接是否保留了 category 和 sort，并追加了 query
    // 注意：URLSearchParams 排序可能不固定，但在测试环境中通常是按插入顺序或字母顺序
    // 这里我们检查字符串包含关系更稳妥，或者精确匹配
    const calledUrl = mockPush.mock.calls[0][0];
    expect(calledUrl).toContain("/products?");
    expect(calledUrl).toContain("category=shoes");
    expect(calledUrl).toContain("sort=price");
    expect(calledUrl).toContain("query=nike");
  });

  it("removes query param when input is empty", () => {
    // 模拟 URL 中已有 ?query=old
    mockSearchParams.set("query", "old");

    render(<SearchBar />);

    const input = screen.getByPlaceholderText("搜索商品...");

    // 清空输入框
    fireEvent.change(input, { target: { value: "" } });

    // 触发搜索
    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    // 验证跳转链接中不再包含 query 参数
    expect(mockPush).toHaveBeenCalledWith("/products?");
  });
});
