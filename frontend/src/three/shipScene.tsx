import { OrbitControls } from "@react-three/drei";
import type { ShipInput, CargoPlacement } from "../types/stowage";

type Props = {
  ship: ShipInput;
  placements: CargoPlacement[];
};

export function ShipScene({ ship, placements }: Props) {
  return (
    <>
      <ambientLight />
      <directionalLight position={[10, 20, 10]} />

      {/* Ship hull wireframe */}
      <mesh>
        <boxGeometry args={[ship.length, ship.height, ship.width]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Cargos */}
      {placements.map((p) => (
        <mesh
          key={p.id}
          position={[
            p.x + p.length / 2,
            p.y + p.height / 2,
            p.z + p.width / 2,
          ]}
        >
          <boxGeometry args={[p.length, p.height, p.width]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}

      <OrbitControls
        makeDefault
        target={[ship.length / 2, ship.height / 2, ship.width / 2]}
      />
    </>
  );
}
