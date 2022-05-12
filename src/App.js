import * as THREE from "three";
import { Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { LayerMaterial, Depth, Noise } from "lamina";

import BloodCells from "./BloodCells";
import Characters from "./Characters";

export default function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 22 }}>
      <Bg />
      <Suspense fallback={null}>
        <BloodCells />
        <Characters />
        <Caption>
          {`CREATIVITY\nIS IN\nMY VEINS.`}
        </Caption>
        <Rig />
      </Suspense>
    </Canvas>
  );
}

function Caption({ children }) {
  const { width } = useThree((state) => state.viewport);
  return (
    <Text
      position={[0, 0, -5]}
      lineHeight={0.8}
      font="/Ki-Medium.ttf"
      fontSize={width / 8}
      material-toneMapped={false}
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
}

function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    state.camera.position.lerp(
      v.set(state.mouse.x / 2, state.mouse.y / 2, 10),
      0.05
    );
  });
}

function Bg() {
  const lightRedColor = new THREE.Color("#290101").convertSRGBToLinear();
  const darkRedColor = new THREE.Color("#850303").convertSRGBToLinear();

  return (
    <mesh scale={100}>
      <boxGeometry args={[1, 1, 1]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth
          colorB={lightRedColor}
          colorA={darkRedColor}
          alpha={1}
          mode="normal"
          near={130}
          far={200}
          origin={[100, 100, -100]}
        />
        <Noise
          mapping="local"
          type="white"
          scale={1000}
          colorA="white"
          colorB="black"
          mode="subtract"
          alpha={0.2}
        />
      </LayerMaterial>
    </mesh>
  );
}
