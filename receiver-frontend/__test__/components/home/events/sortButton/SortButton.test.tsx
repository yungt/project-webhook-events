import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {SortTypes} from "../../../../../frontend/lib/sorts/types/SortTypes";
import SortButton from "@components/home/events/sortButton/SortButton";

jest.mock("@mantine/core", () => ({
  Button: ({children, onClick, className, ...props}: any) => (
    <button
      data-testid="mantineButton"
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@components/home/events/sortButton/SortButton.module.scss", () => ({
  sortButton: "styles.sortButton",
}));

describe("SortButton Component", () => {
  const mockOnUpdate = jest.fn();
  const defaultProps = {
    sortType: SortTypes.ID_ASCENDING,
    ascendingType: SortTypes.ID_ASCENDING,
    descendingType: SortTypes.ID_DESCENDING,
    onUpdate: mockOnUpdate,
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toggle", () => {
    it("should toggle to ascending when currently descending", () => {
      render(
        <SortButton
          {...defaultProps}
          sortType={SortTypes.ID_DESCENDING}
          ascendingType={SortTypes.ID_ASCENDING}
          descendingType={SortTypes.ID_DESCENDING}
        />
      );

      fireEvent.click(screen.getByTestId("mantineButton"));

      expect(mockOnUpdate).toHaveBeenCalledWith(SortTypes.ID_ASCENDING);
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });

    it("should toggle to descending when currently ascending", () => {
      render(
        <SortButton
          {...defaultProps}
          sortType={SortTypes.ID_ASCENDING}
          ascendingType={SortTypes.ID_ASCENDING}
          descendingType={SortTypes.ID_DESCENDING}
        />
      );

      fireEvent.click(screen.getByTestId("mantineButton"));

      expect(mockOnUpdate).toHaveBeenCalledWith(SortTypes.ID_DESCENDING);
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });

    it("should set to id ascending when current type is neither id ascending nor descending", () => {
      render(
        <SortButton
          {...defaultProps}
          sortType={SortTypes.TIMESTAMP_ASCENDING}
          ascendingType={SortTypes.ID_ASCENDING}
          descendingType={SortTypes.ID_DESCENDING}
        />
      );

      fireEvent.click(screen.getByTestId("mantineButton"));

      expect(mockOnUpdate).toHaveBeenCalledWith(SortTypes.ID_ASCENDING);
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });

  });

  describe("styles", () => {
    it('should apply correct CSS classes', () => {
      render(<SortButton {...defaultProps} />);

      const button = screen.getByTestId("mantineButton");
      expect(button).toHaveClass("styles.sortButton");
    });

  });
});



