import { api } from "./client";
import type { StowageRequest, StowageResponse } from "../types/stowage";

export async function optimizeStowage(payload: StowageRequest) {
  const { data } = await api.post<StowageResponse>("/stowage/optimize", payload);
  return data;
}
