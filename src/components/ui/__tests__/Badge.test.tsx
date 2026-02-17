import React from "react";
import { render } from "@testing-library/react-native";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children text", () => {
    const { getByText } = render(<Badge>Active</Badge>);
    expect(getByText("Active")).toBeTruthy();
  });

  it("renders with default variant", () => {
    const { getByText } = render(<Badge>Default</Badge>);
    expect(getByText("Default")).toBeTruthy();
  });

  it("renders with secondary variant", () => {
    const { getByText } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(getByText("Secondary")).toBeTruthy();
  });

  it("applies custom backgroundColor via style prop", () => {
    const { toJSON } = render(
      <Badge backgroundColor="#ff0000">Custom BG</Badge>
    );
    const tree = toJSON() as any;
    expect(tree.props.style).toEqual({ backgroundColor: "#ff0000" });
  });

  it("applies custom color to text via style prop", () => {
    const { getByText } = render(<Badge color="#00ff00">Custom Color</Badge>);
    const text = getByText("Custom Color");
    expect(text.props.style).toEqual({ color: "#00ff00" });
  });
});
