export type CautionType = "decomposable" | "fragile" | "waste" | "edible" | "none";

export interface BoxInput {
  id: string;
  length: number;
  width: number;
  height: number;
  caution: CautionType;
}

export interface ContainerInput {
  length: number;
  width: number;
  height: number;
}

export interface PackingRequest {
  container: ContainerInput;
  boxes: BoxInput[];
}

export interface BoxPlacement extends BoxInput {
  x: number;
  y: number;
  z: number;
}

export interface PackingResponse {
  placements: BoxPlacement[];
  utilization: number;
  result_id: number;
  report_url: string;
}
