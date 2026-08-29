import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
    it("renders completed status", () => {
        render(
            <StatusBadge status="COMPLETED" />
        );

        expect(
            screen.getByText("COMPLETED")
        ).toBeInTheDocument();
    });

    it("renders incomplete status", () => {
        render(
            <StatusBadge status="INCOMPLETE" />
        );

        expect(
            screen.getByText("INCOMPLETE")
        ).toBeInTheDocument();
    });

    it("renders missing status", () => {
        render(
            <StatusBadge status="MISSING" />
        );

        expect(
            screen.getByText("MISSING")
        ).toBeInTheDocument();
    });
});