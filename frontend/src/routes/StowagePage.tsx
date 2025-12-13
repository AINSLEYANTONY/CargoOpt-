import { useState } from "react";
import type { ShipForm } from "../components/forms/ShipForm";
import { Stowage3DViewer } from "../components/visualization/Stowage3DViewver";
import type { StowageRequest, StowageResponse } from "../types/stowage";
import { optimizeStowage } from "../api/stowageApi";

export function StowagePage() {
  const [ship, setShip] = useState<StowageRequest["ship"] | null>(null);
  const [result, setResult] = useState<StowageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (req: StowageRequest) => {
    setLoading(true);
    setShip(req.ship);
    try {
      const data = await optimizeStowage(req);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stowage-page">
      <ShipForm onSubmit={handleSubmit} />
      {loading && <p>Optimizing...</p>}
      {ship && result && (
        <>
          <p>Utilization: {(result.utilization * 100).toFixed(2)}%</p>
          <a href={`http://localhost:5000${result.report_url}`} target="_blank">
            Download report
          </a>
          <div style={{ height: "500px", border: "1px solid #ccc" }}>
            <Stowage3DViewer ship={ship} placements={result.placements} />
          </div>
        </>
      )}
    </div>
  );
}
