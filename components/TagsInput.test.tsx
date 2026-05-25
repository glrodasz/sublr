import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TagsInput from "./TagsInput";

const Harness = ({
  initial = [],
  options = [],
  creatable = false,
  placeholder = "Add tags…",
  collapse = false,
  onChange,
}: {
  initial?: string[];
  options?: string[];
  creatable?: boolean;
  placeholder?: string;
  collapse?: boolean;
  onChange?: (next: string[]) => void;
}) => {
  const [values, setValues] = React.useState<string[]>(initial);
  return (
    <TagsInput
      values={values}
      setValues={(next) => {
        setValues(next);
        onChange?.(next);
      }}
      options={options}
      creatable={creatable}
      placeholder={placeholder}
      collapse={collapse}
    />
  );
};

describe("TagsInput", () => {
  it("renders existing values as chips", () => {
    render(<Harness initial={["community", "domains"]} />);
    expect(screen.getByText("community")).toBeInTheDocument();
    expect(screen.getByText("domains")).toBeInTheDocument();
  });

  it("commits a new tag on Enter when creatable", () => {
    const onChange = jest.fn();
    render(<Harness creatable onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.change(input, { target: { value: "Travel" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenLastCalledWith(["travel"]);
  });

  it("commits on comma", () => {
    const onChange = jest.fn();
    render(<Harness creatable onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.change(input, { target: { value: "music" } });
    fireEvent.keyDown(input, { key: "," });

    expect(onChange).toHaveBeenLastCalledWith(["music"]);
  });

  it("prevents duplicate tags (case-insensitive)", () => {
    const onChange = jest.fn();
    render(<Harness creatable initial={["community"]} onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.change(input, { target: { value: "COMMUNITY" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes the last chip when Backspace is pressed on an empty input", () => {
    const onChange = jest.fn();
    render(<Harness creatable initial={["a", "b"]} onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.keyDown(input, { key: "Backspace" });

    expect(onChange).toHaveBeenLastCalledWith(["a"]);
  });

  it("rejects unknown values when not creatable", () => {
    const onChange = jest.fn();
    render(<Harness options={["community", "domains"]} onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.change(input, { target: { value: "travel" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("adds a value selected from the dropdown", () => {
    const onChange = jest.fn();
    render(<Harness options={["community", "domains"]} onChange={onChange} />);
    const input = screen.getByLabelText("Add tags…");

    fireEvent.focus(input);
    fireEvent.click(screen.getByText("community"));

    expect(onChange).toHaveBeenLastCalledWith(["community"]);
  });

  describe("collapse mode", () => {
    it("shows only maxVisible chips plus a +N more badge", () => {
      render(<Harness collapse initial={["a", "b", "c", "d", "e"]} />);
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("b")).toBeInTheDocument();
      expect(screen.queryByText("c")).not.toBeInTheDocument();
      expect(screen.getByText("+3 more")).toBeInTheDocument();
    });

    it("reveals all selected choices in the dropdown", () => {
      render(<Harness collapse initial={["a", "b", "c"]} />);
      fireEvent.click(screen.getByText("+1 more"));
      expect(screen.getByText("Selected")).toBeInTheDocument();
      expect(screen.getByText("c")).toBeInTheDocument();
    });

    it("clears every tag via Clear all", () => {
      const onChange = jest.fn();
      render(<Harness collapse initial={["a", "b"]} onChange={onChange} />);
      fireEvent.click(screen.getByText("Clear all"));
      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("hides the input when every option is selected", () => {
      render(<Harness collapse options={["a", "b"]} initial={["a", "b"]} />);
      expect(screen.queryByLabelText("Add tags…")).not.toBeInTheDocument();
    });
  });
});
