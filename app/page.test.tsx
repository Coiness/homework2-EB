import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home Page", () => {
  it("renders welcome message", () => {
    render(<Home />);
    // The homepage was localized. Check title that now exists
    expect(screen.getByText("homework2-EB")).toBeInTheDocument();
  });

  it("increments counter", () => {
    render(<Home />);
    const incrementButton = screen.getByText("+");
    const counterValue = screen.getByText("0"); // initial state is 0

    expect(counterValue).toBeInTheDocument();

    fireEvent.click(incrementButton);

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
