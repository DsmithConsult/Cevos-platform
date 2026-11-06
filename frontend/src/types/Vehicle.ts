export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  bodyStyle: string;
  drivetrain: string;
  curbWeightLbs: number;
  payloadCapacityLbs: number;
  wheelbaseIn: number;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  gvwrLbs: number;
  cargoVolumeFt3: number;
  doorCount: number;
  seatingCapacity: number;
  batteryLocation: string;
  motorLocation: string;
  electronicsLocation: string;
  thermalSystemLocation: string;
  notes?: string;
}