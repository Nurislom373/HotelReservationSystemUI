export interface CancellationPolicyModel {
  id?: number;
  name: string;
  type: CancellationPolicyType;
  chargeType: CancellationPolicyChargeType;
  rate: number;
}

export enum CancellationPolicyType {
  EARLY = "EARLY",
  LATE = "LATE",
}

export enum CancellationPolicyChargeType {
  FREE_OF_CHARGE = "FREE_OF_CHARGE",
  FIXED_RATE = "FIXED_RATE",
  PERCENTAGE = "PERCENTAGE",
}
