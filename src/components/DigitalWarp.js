/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import * as THREE from "three";

function StarField({ count = 2000 }) {
    const mesh = useRef();
    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Random positions in a tunnel shape
            const r = Math.random() * 10 + 2; // Radius
            const theta = Math.random() * Math.PI * 2; // Angle
            const z = (Math.random() - 0.5) * 100; // Depth

            positions[i * 3] = r * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(theta);
            positions[i * 3 + 2] = z;

            // Gradient Colors: mix of Cyan, Purple, Blue
            const mix = Math.random();
            if (mix > 0.66) color.set("#00f0ff"); // Cyan
            else if (mix > 0.33) color.set("#7c3aed"); // Purple
            else color.set("#ffffff"); // White

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return { positions, colors };
    }, [count]);

    useFrame((state, delta) => {
        if (mesh.current) {
            // Rotation for vortex effect
            mesh.current.rotation.z += delta * 0.2;

            // Move forwards
            for (let i = 0; i < count; i++) {
                const zIndex = i * 3 + 2;
                mesh.current.geometry.attributes.position.array[zIndex] += delta * 20; // Speed

                // Reset particles that pass the camera
                if (mesh.current.geometry.attributes.position.array[zIndex] > 10) {
                    mesh.current.geometry.attributes.position.array[zIndex] = -90;
                }
            }
            mesh.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

StarField.propTypes = {
    count: PropTypes.number
};


export default function DigitalWarp({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500); // 2.5s duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-black"
        >
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                {/* Dark fog for depth */}
                <fog attach="fog" args={['black', 0, 40]} />
                <StarField />
            </Canvas>

            {/* Cinematic Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, letterSpacing: "5px" }}
                    animate={{ opacity: 1, scale: 1, letterSpacing: "10px" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-white text-center px-4 text-xl md:text-5xl font-light tracking-widest md:tracking-[10px] uppercase mix-blend-screen"
                    style={{ textShadow: "0 0 20px rgba(0, 240, 255, 0.5)" }}
                >
                    ACCESSING PORTFOLIO
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 200 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4"
                />
            </div>
        </motion.div>
    );
}

DigitalWarp.propTypes = {
    onComplete: PropTypes.func.isRequired,
};
