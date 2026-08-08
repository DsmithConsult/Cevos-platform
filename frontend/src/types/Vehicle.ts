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
  cargoVolumeFt3: number;
  notes?: string;
}