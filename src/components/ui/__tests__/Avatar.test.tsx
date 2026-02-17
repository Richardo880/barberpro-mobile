import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "../Avatar";

describe("Avatar", () => {
  describe("initials", () => {
    it("shows first letter of a single name", () => {
      const { getByText } = render(<Avatar name="Ricardo" />);
      expect(getByText("R")).toBeTruthy();
    });

    it("shows initials for two-word name", () => {
      const { getByText } = render(<Avatar name="Ricardo Lopez" />);
      expect(getByText("RL")).toBeTruthy();
    });

    it("takes only first two initials for three-word name", () => {
      const { getByText } = render(<Avatar name="Juan Carlos Perez" />);
      expect(getByText("JC")).toBeTruthy();
    });

    it("uppercases initials", () => {
      const { getByText } = render(<Avatar name="ricardo lopez" />);
      expect(getByText("RL")).toBeTruthy();
    });
  });

  describe("image", () => {
    it("renders Image when source is provided", () => {
      const { toJSON } = render(
        <Avatar name="Test" source="https://example.com/photo.jpg" />
      );
      const tree = toJSON() as any;
      // When source is provided, it renders an Image (from expo-image mock → RN Image)
      expect(tree.props.source).toEqual({ uri: "https://example.com/photo.jpg" });
    });

    it("does not render Image when source is null", () => {
      const { getByText } = render(<Avatar name="Test User" source={null} />);
      expect(getByText("TU")).toBeTruthy();
    });
  });
});
