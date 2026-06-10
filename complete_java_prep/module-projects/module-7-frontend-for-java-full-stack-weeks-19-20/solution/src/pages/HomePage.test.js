import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";
describe("HomePage", () => {
    it("renders lesson coverage cards", () => {
        render(_jsx(HomePage, {}));
        expect(screen.getByText("7.1 TypeScript Fundamentals")).toBeInTheDocument();
        expect(screen.getByText("7.4 UI Quality")).toBeInTheDocument();
    });
});
