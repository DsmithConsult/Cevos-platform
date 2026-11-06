// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api", () => ({
  getVehicles: () => new Promise(() => {}),
}));

const savePdf = vi.hoisted(() => vi.fn());

vi.mock("jspdf", () => ({
  default: class {
    setFontSize() {}
    text() {}
    splitTextToSize(text) { return [text]; }
    addPage() {}
    save(fileName) { savePdf(fileName); }
  },
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  savePdf.mockClear();
});

test("demo build supports battery selection, PDF export, and project resume", async () => {
  const { unmount } = render(React.createElement(App));

  fireEvent.click(screen.getByRole("button", { name: "Load QX60 Demo Build" }));

  expect(screen.getByRole("heading", { name: "Conversion Summary" })).toBeTruthy();
  const batterySummaries = () => screen.getAllByText("Battery:", { exact: true })
    .map((label) => label.parentElement.textContent);
  expect(batterySummaries().some((summary) => summary.includes("95 kWh NMC Pack")))
    .toBe(true);

  fireEvent.click(screen.getByRole("button", { name: "75 kWh NMC Pack" }));

  expect(batterySummaries().some((summary) => summary.includes("75 kWh NMC Pack")))
    .toBe(true);

  fireEvent.click(screen.getByRole("button", { name: "Export PDF Report" }));

  await waitFor(() => expect(savePdf).toHaveBeenCalledWith("CEVOS-Conversion-Report.pdf"));

  fireEvent.change(screen.getByLabelText("Project Name"), {
    target: { value: "Release Smoke Build" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save Project" }));

  expect(JSON.parse(window.localStorage.getItem("cevos-projects"))[0].battery)
    .toBe("75 kWh NMC Pack");

  unmount();
  render(React.createElement(App));

  expect(screen.getByRole("heading", { name: "Release Smoke Build" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Load", exact: true }));

  expect(screen.getByLabelText("Project Name").value).toBe("Release Smoke Build");
  expect(batterySummaries().some((summary) => summary.includes("75 kWh NMC Pack")))
    .toBe(true);
});