import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ContainerInput, BoxPlacement } from "../../types/packing";

type Props = {
  container: ContainerInput;
  placements: BoxPlacement[];
};

function ContainerMesh({ container }: { container: ContainerInput }) {
  return (
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
  );
}

function BoxMesh({ p }: { p: BoxPlacement }) {
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

export function Packing3DViewer({ container, placements }: Props) {
  const maxDim = Math.max(container.length, container.height, container.width);
  const cam = maxDim * 2;

  return (
    <Canvas camera={{ position: [cam, cam, cam], fov: 50 }}>
      <ambientLight />
      <directionalLight position={[10, 20, 10]} />
      <ContainerMesh container={container} />
      {placements.map((p) => (
        <BoxMesh key={p.id} p={p} />
      ))}
      <OrbitControls />
    </Canvas>
  );
}
