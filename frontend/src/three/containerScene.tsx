import { OrbitControls } from "@react-three/drei";
import type { ContainerInput, BoxPlacement } from "../types/packing";

type Props = {
  container: ContainerInput;
  placements: BoxPlacement[];
};

export function ContainerScene({ container, placements }: Props) {
  return (
    <>
      <ambientLight />
      <directionalLight position={[10, 20, 10]} />

      {/* Container wireframe */}
      <mesh>
        <boxGeometry
          args={[container.length, container.height, container.width]}
        />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Packed boxes */}
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
          <meshStandardMaterial color="skyblue" />
        </mesh>
      ))}

      <OrbitControls
        makeDefault
        target={[
          container.length / 2,
          container.height / 2,
          container.width / 2,
        ]}
      />
    </>
  );
}
