import * as THREE from "three";
import { useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { LayerMaterial, Depth, Color, Fresnel, Noise } from "lamina/vanilla";

const colorA = new THREE.Color("#121212").convertSRGBToLinear();
const colorB = new THREE.Color("#121212").convertSRGBToLinear();
const fresnel = new THREE.Color("#e57373").convertSRGBToLinear();
const material = new LayerMaterial({
  layers: [
    new Color({ color: colorA }),
    new Depth({
      colorA: colorA,
      colorB: colorB,
      alpha: 0.5,
      mode: "normal",
      near: 0,
      far: 2,
      origin: [1, 1, 1],
    }),
    new Fresnel({
      mode: "add",
      color: fresnel,
      intensity: 0.8,
      power: 2.5,
      bias: 0.0,
    }),
    new Noise({
      mapping: "local",
      type: "curl",
      scale: 10,
      colorA: "black",
      colorB: "black",
      mode: "overlay",
    }),
  ],
});

function BloodCell() {
  const { viewport, camera } = useThree();
  const { nodes } = useGLTF("/blood-cells.glb");
  const geometry = nodes.Cube.geometry;
  const [speed] = useState(() => 0.1 + Math.random() / 10);
  const position = useMemo(() => {
    const z = Math.random() * -30;
    const bounds = viewport.getCurrentViewport(camera, [0, 0, z]);
    return [
      THREE.MathUtils.randFloatSpread(bounds.width),
      THREE.MathUtils.randFloatSpread(bounds.height * 0.75),
      z,
    ];
    // eslint-disable-next-line
  }, [viewport]);
  return (
    <Float
      position={position}
      speed={speed}
      rotationIntensity={10}
      floatIntensity={40}
      dispose={null}
    >
      <mesh scale={0.8} geometry={geometry} material={material} />
    </Float>
  );
}

export default function BloodCells() {
  return Array.from({ length: 50 }, (_, i) => <BloodCell key={i} />);
}

useGLTF.preload("/blood-cells.glb");
