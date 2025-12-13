import { api } from "./client";
import type { PackingRequest, PackingResponse } from "../types/packing";

export async function optimizePacking(payload: PackingRequest) {
  const { data } = await api.post<PackingResponse>("/packing/optimize", payload);
  return data;
}
