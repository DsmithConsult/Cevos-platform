export const getVerifiedComponentWeightLb = (component) => {
  const weightLb = Number(component?.weightLb);
  if (!Number.isFinite(weightLb) || weightLb <= 0) return null;

  try {
    const source = new URL(component.weightSourceUrl);
    return source.protocol === "https:" ? weightLb : null;
  } catch {
    return null;
  }
};
