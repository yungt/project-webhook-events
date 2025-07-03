import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Svg from "../../../../components/common/icons/Svg";

describe("Svg", () => {

  describe("icon rendering", () => {
    it("should render svg icon", () => {
      render(<Svg icon="caret-up" data-testid="svg-icon"/>);

      const svg = screen.getByTestId("svg-icon");
      expect(svg).toBeInTheDocument();
      expect(svg.tagName).toBe("svg");
    });
  });

  describe("size prop", () => {
    it("should use default size of 16 when size prop is not provided", () => {
      render(<Svg icon="caret-up" data-testid="svg-icon"/>);

      const svg = screen.getByTestId("svg-icon");
      expect(svg).toHaveAttribute("width", "16");
      expect(svg).toHaveAttribute("height", "16");
    });

    it("should use custom size when size prop is provided", () => {
      render(<Svg icon="caret-up" size={24} data-testid="svg-icon"/>);

      const svg = screen.getByTestId("svg-icon");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });
});