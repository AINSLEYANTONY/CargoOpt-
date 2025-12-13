import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ShipInput, CargoPlacement } from "../../types/stowage";

type Props = {
  ship: ShipInput;
  placements: CargoPlacement[];
};

function ShipHull({ ship }: { ship: ShipInput }) {
  return (
    <mesh>
      <boxGeometry args={[ship.length, ship.height, ship.width]} />
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function CargoBox({ p }: { p: CargoPlacement }) {
  const color =
    p.caution === "fragile"
      ? "red"
      : p.caution === "edible"
      ? "green"
      : p.caution === "decomposable"
      ? "orange"
      : p.caution === "waste"
      ? "gray"
      : "skyblue";

  return (
    <mesh
      position={[
        p.x + p.length / 2,
        p.y + p.height / 2,
        p.z + p.width / 2,
      ]}
    >
      <boxGeometry args={[p.length, p.height, p.width]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function Stowage3DViewer({ ship, placements }: Props) {
  const maxDim = Math.max(ship.length, ship.height, ship.width);
  const cam = maxDim * 2;

  return (
    <Canvas camera={{ position: [cam, cam, cam], fov: 50 }}>
      <ambientLight />
      <directionalLight position={[10, 20, 10]} />
      <ShipHull ship={ship} />
      {placements.map((p) => (
        <CargoBox key={p.id} p={p} />
      ))}
      <OrbitControls />
    </Canvas>
  );
}
