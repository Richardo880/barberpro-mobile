import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("renders with correct width percentage", () => {
    const { toJSON } = render(<ProgressBar progress={50} />);
    const tree = toJSON() as any;
    // The inner View (fill bar) is the second child
    const fillBar = tree.children[0];
    expect(fillBar.props.style).toEqual(
      expect.objectContaining({ width: "50%" })
    );
  });

  it("clamps progress below 0 to 0%", () => {
    const { toJSON } = render(<ProgressBar progress={-10} />);
    const tree = toJSON() as any;
    const fillBar = tree.children[0];
    expect(fillBar.props.style).toEqual(
      expect.objectContaining({ width: "0%" })
    );
  });

  it("clamps progress above 100 to 100%", () => {
    const { toJSON } = render(<ProgressBar progress={150} />);
    const tree = toJSON() as any;
    const fillBar = tree.children[0];
    expect(fillBar.props.style).toEqual(
      expect.objectContaining({ width: "100%" })
    );
  });

  it("renders 0% progress", () => {
    const { toJSON } = render(<ProgressBar progress={0} />);
    const tree = toJSON() as any;
    const fillBar = tree.children[0];
    expect(fillBar.props.style).toEqual(
      expect.objectContaining({ width: "0%" })
    );
  });

  it("renders 100% progress", () => {
    const { toJSON } = render(<ProgressBar progress={100} />);
    const tree = toJSON() as any;
    const fillBar = tree.children[0];
    expect(fillBar.props.style).toEqual(
      expect.objectContaining({ width: "100%" })
    );
  });
});
