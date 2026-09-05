import { render, screen } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("announces itself as an alert with default copy", () => {
    render(<ErrorState />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Couldn't load this data");
  });

  it("renders custom copy", () => {
    render(<ErrorState title="Rates unavailable" description="Try again later." />);
    expect(screen.getByText("Rates unavailable")).toBeInTheDocument();
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
  });
});
