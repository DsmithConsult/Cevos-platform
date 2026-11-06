import assert from "node:assert/strict";
import test from "node:test";
import batteries from "./batteries.js";
import motors from "./motors.js";
import { getVerifiedComponentWeightLb } from "../services/componentData.js";

test("catalog components declare unknown mass instead of implying a specification", () => {
  for (const component of [...batteries, ...motors]) {
    assert.equal(component.weightLb, null, `${component.id} weight should remain unknown`);
    assert.equal(component.weightSourceUrl, null, `${component.id} source should remain unknown`);
    assert.equal(getVerifiedComponentWeightLb(component), null);
  }
});

test("accepts a positive mass only when an HTTPS source is provided", () => {
  const sourcedComponent = {
    weightLb: 850,
    weightSourceUrl: "https://manufacturer.example/specifications",
  };

  assert.equal(getVerifiedComponentWeightLb(sourcedComponent), 850);
  assert.equal(getVerifiedComponentWeightLb({ ...sourcedComponent, weightSourceUrl: null }), null);
  assert.equal(getVerifiedComponentWeightLb({ ...sourcedComponent, weightSourceUrl: "http://example.com" }), null);
  assert.equal(getVerifiedComponentWeightLb({ ...sourcedComponent, weightLb: 0 }), null);
});
