import React from "react";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../../app/page";

jest.mock("../../components/home/Home", () => {
  return function MockHome() {
    return <div data-testid="homeComponent">Home Component</div>;
  };
});

describe("HomePage", () => {
  it("should render the Home component", () => {
    const {getByTestId} = render(<HomePage/>);
    expect(getByTestId("homeComponent")).toBeInTheDocument();
    expect(() => render(<HomePage/>)).not.toThrow();
  });
});