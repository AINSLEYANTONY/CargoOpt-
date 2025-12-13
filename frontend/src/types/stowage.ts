export type CautionType = "decomposable" | "fragile" | "waste" | "edible" | "none";

export interface CargoInput {
  id: string;
  length: number;
  width: number;
  height: number;
  caution: CautionType;
}

export interface ShipInput {
  length: number;
  width: number;
  height: number;
}

export interface StowageRequest {
  ship: ShipInput;
  cargos: CargoInput[];
}

export interface CargoPlacement extends CargoInput {
  x: number;
  y: number;
  z: number;
}

export interface StowageResponse {
  placements: CargoPlacement[];
  utilization: number;
  result_id: number;
  report_url: string;
}
