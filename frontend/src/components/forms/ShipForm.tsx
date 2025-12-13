import { useState } from "react";
import type {
  ShipInput,
  CargoInput,
  StowageRequest,
  CautionType,
} from "../../types/stowage";

type Props = {
  onSubmit: (req: StowageRequest) => void;
};

export function ShipForm({ onSubmit }: Props) {
  const [ship, setShip] = useState<ShipInput>({
    length: 100,
    width: 30,
    height: 20,
  });

  const [cargos, setCargos] = useState<CargoInput[]>([
    { id: "cargo-1", length: 2, width: 2, height: 2, caution: "fragile" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ship, cargos });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h2>Ship details</h2>
      <div>
        <label>Length</label>
        <input
          type="number"
          value={ship.length}
          onChange={(e) =>
            setShip((s) => ({ ...s, length: Number(e.target.value) }))
          }
        />
      </div>
      <div>
        <label>Width</label>
        <input
          type="number"
          value={ship.width}
          onChange={(e) =>
            setShip((s) => ({ ...s, width: Number(e.target.value) }))
          }
        />
      </div>
      <div>
        <label>Height</label>
        <input
          type="number"
          value={ship.height}
          onChange={(e) =>
            setShip((s) => ({ ...s, height: Number(e.target.value) }))
          }
        />
      </div>

      <h3>Cargos</h3>
      {cargos.map((c, idx) => (
        <div key={c.id} style={{ display: "flex", gap: "0.5rem" }}>
          <span>{c.id}</span>
          <input
            type="number"
            value={c.length}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCargos((prev) =>
                prev.map((pc, i) => (i === idx ? { ...pc, length: v } : pc)),
              );
            }}
          />
          <input
            type="number"
            value={c.width}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCargos((prev) =>
                prev.map((pc, i) => (i === idx ? { ...pc, width: v } : pc)),
              );
            }}
          />
          <input
            type="number"
            value={c.height}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCargos((prev) =>
                prev.map((pc, i) => (i === idx ? { ...pc, height: v } : pc)),
              );
            }}
          />
          <select
            value={c.caution}
            onChange={(e) => {
              const v = e.target.value as CautionType;
              setCargos((prev) =>
                prev.map((pc, i) => (i === idx ? { ...pc, caution: v } : pc)),
              );
            }}
          >
            <option value="none">None</option>
            <option value="decomposable">Decomposable</option>
            <option value="fragile">Fragile</option>
            <option value="waste">Waste</option>
            <option value="edible">Edible</option>
          </select>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setCargos((prev) => [
            ...prev,
            {
              id: `cargo-${prev.length + 1}`,
              length: 1,
              width: 1,
              height: 1,
              caution: "none",
            },
          ])
        }
      >
        Add cargo
      </button>

      <button type="submit">Optimize stowage</button>
    </form>
  );
}
