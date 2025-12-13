import { useState } from "react";
import { ContainerForm } from "../components/forms/ContainerForm";
import { Packing3DViewer } from "../components/visualization/Packing3DViewer";
import type { PackingRequest, PackingResponse } from "../types/packing";
import { optimizePacking } from "../api/packingApi";

export function PackingPage() {
  const [container, setContainer] = useState<PackingRequest["container"] | null>(
    null,
  );
  const [result, setResult] = useState<PackingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (req: PackingRequest) => {
    setLoading(true);
    setContainer(req.container);
    try {
      const data = await optimizePacking(req);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="packing-page" style={{ display: "flex", gap: "2rem" }}>
      <ContainerForm onSubmit={handleSubmit} />
      <div style={{ flex: 1 }}>
        {loading && <p>Optimizing...</p>}
        {container && result && (
          <>
            <p>Utilization: {(result.utilization * 100).toFixed(2)}%</p>
            <a
              href={`http://localhost:5000${result.report_url}`}
              target="_blank"
              rel="noreferrer"
            >
              Download report
            </a>
            <div style={{ height: "500px", border: "1px solid #ccc" }}>
              <Packing3DViewer
                container={container}
                placements={result.placements}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
