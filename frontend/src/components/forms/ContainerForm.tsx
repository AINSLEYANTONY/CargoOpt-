import { useState } from "react";
import type {
  BoxInput,
  ContainerInput,
  PackingRequest,
  CautionType,
} from "../../types/packing";

type Props = {
  onSubmit: (req: PackingRequest) => void;
};

export function ContainerForm({ onSubmit }: Props) {
  const [container, setContainer] = useState<ContainerInput>({
    length: 10,
    width: 5,
    height: 5,
  });

  const [boxes, setBoxes] = useState<BoxInput[]>([
    { id: "box-1", length: 2, width: 2, height: 2, caution: "fragile" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ container, boxes });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h2>Container details</h2>
      <div>
        <label>Length</label>
        <input
          type="number"
          value={container.length}
          onChange={(e) =>
            setContainer((c) => ({ ...c, length: Number(e.target.value) }))
          }
        />
      </div>
      <div>
        <label>Width</label>
        <input
          type="number"
          value={container.width}
          onChange={(e) =>
            setContainer((c) => ({ ...c, width: Number(e.target.value) }))
          }
        />
      </div>
      <div>
        <label>Height</label>
        <input
          type="number"
          value={container.height}
          onChange={(e) =>
            setContainer((c) => ({ ...c, height: Number(e.target.value) }))
          }
        />
      </div>

      <h3>Boxes</h3>
      {boxes.map((b, idx) => (
        <div key={b.id} style={{ display: "flex", gap: "0.5rem" }}>
          <span>{b.id}</span>
          <input
            type="number"
            value={b.length}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBoxes((prev) =>
                prev.map((pb, i) => (i === idx ? { ...pb, length: v } : pb)),
              );
            }}
          />
          <input
            type="number"
            value={b.width}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBoxes((prev) =>
                prev.map((pb, i) => (i === idx ? { ...pb, width: v } : pb)),
              );
            }}
          />
          <input
            type="number"
            value={b.height}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBoxes((prev) =>
                prev.map((pb, i) => (i === idx ? { ...pb, height: v } : pb)),
              );
            }}
          />
          <select
            value={b.caution}
            onChange={(e) => {
              const v = e.target.value as CautionType;
              setBoxes((prev) =>
                prev.map((pb, i) => (i === idx ? { ...pb, caution: v } : pb)),
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
          setBoxes((prev) => [
            ...prev,
            {
              id: `box-${prev.length + 1}`,
              length: 1,
              width: 1,
              height: 1,
              caution: "none",
            },
          ])
        }
      >
        Add box
      </button>

      <button type="submit">Optimize packing</button>
    </form>
  );
}
