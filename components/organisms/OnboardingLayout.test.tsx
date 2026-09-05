import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingLayout, ONBOARDING_STEPS } from "./OnboardingLayout";

const pushMock = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

beforeEach(() => {
  pushMock.mockReset();
});

describe("OnboardingLayout", () => {
  it("renders the title and all four step labels", () => {
    render(
      <OnboardingLayout step={1}>
        <p>body</p>
      </OnboardingLayout>
    );

    expect(screen.getByRole("heading", { name: "Assisted setup" })).toBeInTheDocument();
    ONBOARDING_STEPS.forEach((s, i) => {
      expect(screen.getByText(`${i + 1}. ${s.label}`)).toBeInTheDocument();
    });
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("marks the current step with aria-current", () => {
    render(
      <OnboardingLayout step={3}>
        <p>body</p>
      </OnboardingLayout>
    );

    const current = screen.getByText("3. Incomes");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("1. Categories")).not.toHaveAttribute("aria-current");
  });

  it("fills the progress bar proportionally to the step", () => {
    const { container, rerender } = render(
      <OnboardingLayout step={1}>
        <p>body</p>
      </OnboardingLayout>
    );
    expect(container.querySelector(".fill")).toHaveStyle({ width: "25%" });

    rerender(
      <OnboardingLayout step={4}>
        <p>body</p>
      </OnboardingLayout>
    );
    expect(container.querySelector(".fill")).toHaveStyle({ width: "100%" });
  });

  it("navigates to the previous step when back is pressed", () => {
    render(
      <OnboardingLayout step={3}>
        <p>body</p>
      </OnboardingLayout>
    );

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    expect(pushMock).toHaveBeenCalledWith("/onboarding/methods");
  });

  it("leaves the wizard from step 1 rather than going out of bounds", () => {
    render(
      <OnboardingLayout step={1}>
        <p>body</p>
      </OnboardingLayout>
    );

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("renders the description and footer when provided", () => {
    render(
      <OnboardingLayout
        step={2}
        description="Add your main payment methods"
        footer={<span>actions</span>}
      >
        <p>body</p>
      </OnboardingLayout>
    );

    expect(screen.getByText("Add your main payment methods")).toBeInTheDocument();
    expect(screen.getByText("actions")).toBeInTheDocument();
  });
});
