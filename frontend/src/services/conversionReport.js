const WEIGHT_BALANCE_FIELDS = [
  ["vehicleWeightLb", "Baseline curb weight"],
  ["frontAxleWeightLb", "Baseline front axle scale weight"],
  ["wheelbaseIn", "Wheelbase"],
  ["removedDrivetrainWeightLb", "Removed drivetrain weight"],
  ["removedDrivetrainPositionIn", "Removed drivetrain position from front axle"],
  ["batteryWeightLb", "Battery weight"],
  ["batteryPositionIn", "Battery position from front axle"],
  ["motorWeightLb", "Motor weight"],
  ["motorPositionIn", "Motor position from front axle"],
];

const valueWithUnit = (value, unit) => value === "" || value === null || value === undefined
  ? "Not entered"
  : `${value} ${unit}`;

const getSourceLine = (inputs, field, label) => {
  const sourceUrl = String(inputs?.[field] || "").trim();
  if (!sourceUrl) return `${label} source URL: Not provided`;
  try {
    if (new URL(sourceUrl).protocol === "https:") {
      return `${label} source URL (user-provided; not independently verified): ${sourceUrl}`;
    }
  } catch {
    return `${label} source URL (invalid; not used as verification): ${sourceUrl}`;
  }
  return `${label} source URL (HTTPS required; not used as verification): ${sourceUrl}`;
};

const money = (value) => `$${Number(value || 0).toLocaleString()}`;

export const getConversionReportSections = ({
  projectName,
  projectStatus,
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  estimatedRange,
  estimatedCost,
  assessment,
  weightBalanceInputs,
  weightBalanceEstimate,
  bom,
}) => {
  const additionalComponents = Array.isArray(weightBalanceInputs?.additionalComponents)
    ? weightBalanceInputs.additionalComponents
    : [];
  const sections = [
    {
      title: "Build Summary",
      lines: [
        `Project: ${projectName || "Unnamed build"}`,
        `Workflow status: ${projectStatus || "Draft"}`,
        `Vehicle: ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        `Battery: ${selectedBattery.name} (${selectedBattery.capacity} kWh)`,
        `Motor: ${selectedMotor.name} (${selectedMotor.power} kW, ${selectedMotor.torque} Nm)`,
        `Estimated range: ${estimatedRange} miles`,
        `Estimated component cost: ${money(estimatedCost)}`,
      ],
    },
    {
      title: "Estimate Assumptions",
      lines: [
        "Range estimate uses battery capacity multiplied by 3 miles per kWh.",
        "Component cost includes the selected battery and motor only; installation, controls, thermal systems, and other parts are excluded.",
        "Estimates are for early planning and are not guarantees of performance or cost.",
      ],
    },
    {
      title: "Weight-Balance Planning Inputs",
      lines: [
        ...WEIGHT_BALANCE_FIELDS.map(([key, label]) => {
          const unit = key.endsWith("PositionIn") || key === "wheelbaseIn" ? "in" : "lb";
          return `${label}: ${valueWithUnit(weightBalanceInputs?.[key], unit)}`;
        }),
        "Additional components:",
        ...(additionalComponents.length
          ? additionalComponents.flatMap((component, index) => [
            `${index + 1}. ${component.name || "Unnamed component"} - ${component.direction || "direction not set"}, ${valueWithUnit(component.weightLb, "lb")} at ${valueWithUnit(component.positionIn, "in")}`,
            getSourceLine({ sourceUrl: component.sourceUrl }, "sourceUrl", `${component.name || `Additional component ${index + 1}`} weight`),
          ])
          : ["None entered"]),
        getSourceLine(weightBalanceInputs, "batteryWeightSourceUrl", "Battery weight"),
        getSourceLine(weightBalanceInputs, "motorWeightSourceUrl", "Motor weight"),
        weightBalanceEstimate.status === "calculated"
          ? `Estimated front axle load: ${Math.round(weightBalanceEstimate.frontAxleLoadLb)} lb (${weightBalanceEstimate.frontAxlePercent.toFixed(1)}%)`
          : `Weight-balance estimate: ${weightBalanceEstimate.status === "invalid" ? "Not calculated - inputs need correction" : "Not calculated - required inputs incomplete"}`,
        ...(weightBalanceEstimate.status === "calculated"
          ? [
            `Estimated rear axle load: ${Math.round(weightBalanceEstimate.rearAxleLoadLb)} lb (${weightBalanceEstimate.rearAxlePercent.toFixed(1)}%)`,
            `Estimated total vehicle weight: ${Math.round(weightBalanceEstimate.estimatedVehicleWeightLb)} lb`,
          ]
          : weightBalanceEstimate.status === "invalid"
            ? weightBalanceEstimate.errors.map((error) => `Input issue: ${error}`)
            : [`Missing inputs: ${weightBalanceEstimate.missing.join(", ")}`]),
        "Calculation assumes level ground and includes only the entered removed drivetrain, battery, motor, and additional component masses. Other unlisted parts, occupants, axle ratings, suspension, and dynamic loading are excluded; it is not a safe-load determination.",
      ],
    },
    {
      title: `Preliminary Compatibility Review: ${assessment.label}`,
      lines: [
        assessment.disclaimer,
        "Screening basis:",
        ...(assessment.basis || []).map((item) => `- ${item}`),
        "Findings:",
        ...assessment.findings.map((finding) => `- ${finding}`),
        "Recommended next steps:",
        ...(assessment.nextSteps || []).map((step) => `- ${step}`),
        "Not assessed:",
        ...assessment.notAssessed.map((item) => `- ${item}`),
      ],
    },
    {
      title: "Planning Bill of Materials",
      lines: bom.map((item) => `- ${item}`),
    },
  ];

  return sections;
};

export const renderConversionReport = (doc, sections) => {
  const marginX = 20;
  const contentWidth = 170;
  const bottomMargin = 20;
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  const ensureSpace = (height) => {
    if (y + height > pageHeight - bottomMargin) {
      doc.addPage();
      y = 20;
    }
  };
  const writeParagraph = (text, fontSize, indent = 0) => {
    doc.setFontSize(fontSize);
    const wrapped = doc.splitTextToSize(text, contentWidth - indent);
    const maxLinesPerPage = Math.max(1, Math.floor((pageHeight - bottomMargin - 20) / lineHeight));
    for (let offset = 0; offset < wrapped.length;) {
      const availableLines = Math.max(1, Math.floor((pageHeight - bottomMargin - y) / lineHeight));
      if (availableLines === 0 || y + lineHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = 20;
        continue;
      }
      const count = Math.min(availableLines, maxLinesPerPage, wrapped.length - offset);
      ensureSpace(count * lineHeight);
      doc.text(wrapped.slice(offset, offset + count), marginX + indent, y);
      y += count * lineHeight;
      offset += count;
      if (offset < wrapped.length) {
        doc.addPage();
        y = 20;
      }
    }
  };

  writeParagraph("CEVOS Conversion Report", 18);
  y += 4;
  for (const section of sections) {
    ensureSpace(lineHeight * 2);
    writeParagraph(section.title, 13);
    for (const line of section.lines) writeParagraph(line, 10, line.startsWith("- ") ? 4 : 0);
    y += 4;
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(9);
    doc.text(`CEVOS planning report - page ${page} of ${totalPages}`, marginX, pageHeight - 10);
  }
};
