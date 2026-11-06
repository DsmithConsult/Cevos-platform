// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api", () => ({
  getVehicles: () => new Promise(() => {}),
}));

const { savePdf, pdfText } = vi.hoisted(() => ({ savePdf: vi.fn(), pdfText: [] }));

vi.mock("jspdf", () => ({
  default: class {
    constructor() { this.pages = 1; this.internal = { pageSize: { getHeight: () => 297 } }; }
    setFontSize() {}
    text(value) { pdfText.push(value); }
    splitTextToSize(text) { return [text]; }
    addPage() { this.pages += 1; }
    getNumberOfPages() { return this.pages; }
    setPage() {}
    save(fileName) { savePdf(fileName); }
  },
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  savePdf.mockClear();
  pdfText.length = 0;
});

test("demo build supports battery selection, PDF export, and project resume", async () => {
  const { unmount } = render(React.createElement(App));

  fireEvent.click(screen.getByRole("button", { name: "Load QX60 Demo Build" }));

  expect(screen.getByRole("heading", { name: "Conversion Summary" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Screening Basis" })).toBeTruthy();
  expect(screen.getAllByRole("heading", { name: "Recommended Next Steps" }).length).toBeGreaterThan(0);
  const batterySummaries = () => screen.getAllByText("Battery:", { exact: true })
    .map((label) => label.parentElement.textContent);
  expect(batterySummaries().some((summary) => summary.includes("95 kWh NMC Pack")))
    .toBe(true);

  fireEvent.click(screen.getByRole("button", { name: "75 kWh NMC Pack" }));

  expect(batterySummaries().some((summary) => summary.includes("75 kWh NMC Pack")))
    .toBe(true);

  fireEvent.change(screen.getByLabelText("Project Name"), {
    target: { value: "Release Smoke Build" },
  });
  const weightInputs = {
    "Vehicle curb weight (lb)": "4000",
    "Front axle scale weight (lb)": "2400",
    "Wheelbase (in)": "120",
    "Removed drivetrain weight (lb)": "500",
    "Removed drivetrain center from front axle (in)": "20",
    "Battery weight (lb)": "900",
    "Battery center from front axle (in)": "60",
    "Motor weight (lb)": "200",
    "Motor center from front axle (in)": "20",
  };
  for (const [label, value] of Object.entries(weightInputs)) {
    fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });
  }
  fireEvent.change(screen.getByLabelText("Battery weight source URL (optional)", { exact: false }), {
    target: { value: "https://supplier.example/battery-datasheet.pdf" },
  });
  fireEvent.change(screen.getByLabelText("Motor weight source URL (optional)", { exact: false }), {
    target: { value: "https://supplier.example/motor-datasheet.pdf" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add component" }));
  fireEvent.change(screen.getByLabelText("Component name"), { target: { value: "Inverter" } });
  fireEvent.change(screen.getByLabelText("Weight (lb)"), { target: { value: "100" } });
  fireEvent.change(screen.getByLabelText("Center from front axle (in)"), { target: { value: "100" } });
  fireEvent.change(screen.getByLabelText(/^Weight source URL/), {
    target: { value: "https://supplier.example/inverter-datasheet.pdf" },
  });
  expect(screen.getByText("Front: 2,617 lb (55.7%)")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Export PDF Report" }));
  await waitFor(() => expect(savePdf).toHaveBeenCalledWith("CEVOS-Conversion-Report.pdf"));
  expect(pdfText.flat()).toContain("Estimated front axle load: 2617 lb (55.7%)");
  expect(pdfText.flat()).toContain("1. Inverter - added, 100 lb at 100 in");
  expect(pdfText.flat()).toContain("Inverter weight source URL (user-provided; not independently verified): https://supplier.example/inverter-datasheet.pdf");
  expect(pdfText.flat()).toContain("Battery position from front axle: 60 in");
  expect(pdfText.flat()).toContain("Battery weight source URL (user-provided; not independently verified): https://supplier.example/battery-datasheet.pdf");
  expect(pdfText.flat()).toContain("Motor weight source URL (user-provided; not independently verified): https://supplier.example/motor-datasheet.pdf");
  expect(pdfText.flat()).toContain("Calculation assumes level ground and includes only the entered removed drivetrain, battery, motor, and additional component masses. Other unlisted parts, occupants, axle ratings, suspension, and dynamic loading are excluded; it is not a safe-load determination.");
  fireEvent.click(screen.getByRole("button", { name: "Save Project" }));

  expect(JSON.parse(window.localStorage.getItem("cevos-projects"))[0].battery)
    .toBe("75 kWh NMC Pack");
  expect(JSON.parse(window.localStorage.getItem("cevos-projects"))[0].weightBalanceInputs.vehicleWeightLb)
    .toBe("4000");
  expect(JSON.parse(window.localStorage.getItem("cevos-projects"))[0].weightBalanceInputs.batteryWeightSourceUrl)
    .toBe("https://supplier.example/battery-datasheet.pdf");
  expect(JSON.parse(window.localStorage.getItem("cevos-projects"))[0].weightBalanceInputs.additionalComponents[0].name)
    .toBe("Inverter");

  unmount();
  render(React.createElement(App));

  expect(screen.getByRole("heading", { name: "Release Smoke Build" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Load", exact: true }));

  expect(screen.getByLabelText("Project Name").value).toBe("Release Smoke Build");
  expect(screen.getByLabelText("Vehicle curb weight (lb)", { exact: false }).value).toBe("4000");
  expect(screen.getByLabelText("Battery weight source URL (optional)", { exact: false }).value)
    .toBe("https://supplier.example/battery-datasheet.pdf");
  expect(screen.getByText("Front: 2,617 lb (55.7%)")).toBeTruthy();
  expect(screen.getByLabelText("Component name").value).toBe("Inverter");
  expect(batterySummaries().some((summary) => summary.includes("75 kWh NMC Pack")))
    .toBe(true);
});