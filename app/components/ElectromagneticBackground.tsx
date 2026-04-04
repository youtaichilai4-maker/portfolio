"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── 定数 ──
const CYAN = new THREE.Color(0x06b6d4);
const PURPLE = new THREE.Color(0x8b5cf6);
const BG_COLOR = 0x030712;

const GEOMETRY_COUNT = 13;
const WAVE_SEGMENTS = 64;
const RIPPLE_COUNT = 6;
const CONNECTION_DIST = 4.5;
const MOUSE_INFLUENCE = 8;

// ── 型定義 ──
interface FloatingBody {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    rotationSpeed: THREE.Vector3;
    baseScale: number;
    phase: number;
}

interface WaveConnection {
    line: THREE.Line;
    from: number;
    to: number;
}

interface Ripple {
    ring: THREE.Mesh;
    birth: number;
    active: boolean;
}

// ── ジオメトリ生成 ──
function createGeometries(): THREE.BufferGeometry[] {
    return [
        new THREE.IcosahedronGeometry(0.4, 0),   // 分子・結晶
        new THREE.OctahedronGeometry(0.35, 0),    // 結晶構造
        new THREE.TorusGeometry(0.3, 0.1, 8, 16), // 磁場ループ
        new THREE.TetrahedronGeometry(0.35, 0),   // 単純結晶
        new THREE.DodecahedronGeometry(0.3, 0),   // 準結晶
        new THREE.BoxGeometry(0.4, 0.4, 0.4),     // 格子
        new THREE.TorusKnotGeometry(0.25, 0.08, 48, 8, 2, 3), // 複雑場
    ];
}

// ── 正弦波の頂点生成 ──
function buildWavePositions(
    from: THREE.Vector3,
    to: THREE.Vector3,
    time: number,
    freq: number,
    amp: number,
): Float32Array {
    const positions = new Float32Array(WAVE_SEGMENTS * 3);
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    dir.normalize();

    // 波の振動方向（dirに垂直）
    const up = new THREE.Vector3(0, 1, 0);
    const perp1 = new THREE.Vector3().crossVectors(dir, up).normalize();
    if (perp1.length() < 0.01) perp1.set(1, 0, 0);
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize();

    for (let i = 0; i < WAVE_SEGMENTS; i++) {
        const t = i / (WAVE_SEGMENTS - 1);
        const pos = new THREE.Vector3().copy(from).addScaledVector(dir, t * length);

        // 端でフェードアウトする正弦波
        const envelope = Math.sin(t * Math.PI);
        const wave1 = Math.sin(t * freq * Math.PI * 2 + time * 3) * amp * envelope;
        const wave2 = Math.cos(t * freq * Math.PI * 2 + time * 2.3) * amp * 0.5 * envelope;

        pos.addScaledVector(perp1, wave1);
        pos.addScaledVector(perp2, wave2);

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
    }
    return positions;
}

// ── メインコンポーネント ──
export default function ElectromagneticBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseNDC = useRef(new THREE.Vector2(0, 0));
    const mouseWorld = useRef(new THREE.Vector3(0, 0, 0));
    const mouseSpeed = useRef(0);
    const prevMouseNDC = useRef(new THREE.Vector2(0, 0));
    const lastRippleTime = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── レンダラ ──
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(BG_COLOR, 0);
        container.appendChild(renderer.domElement);

        // ── シーン・カメラ ──
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(BG_COLOR, 0.06);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100,
        );
        camera.position.set(0, 0, 12);

        // ── ライティング ──
        const ambient = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambient);
        const pointLight = new THREE.PointLight(CYAN, 2, 30);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        // ── 浮遊ジオメトリ ──
        const geos = createGeometries();
        const bodies: FloatingBody[] = [];

        for (let i = 0; i < GEOMETRY_COUNT; i++) {
            const geo = geos[i % geos.length];
            const isCyan = Math.random() > 0.35;
            const color = isCyan ? CYAN.clone() : PURPLE.clone();

            const mat = new THREE.MeshStandardMaterial({
                color,
                emissive: color.clone().multiplyScalar(0.4),
                wireframe: true,
                transparent: true,
                opacity: 0.6,
            });

            const mesh = new THREE.Mesh(geo, mat);
            const spread = 9;
            mesh.position.set(
                (Math.random() - 0.5) * spread * 2,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * 4 - 2,
            );

            const s = 0.7 + Math.random() * 0.8;
            mesh.scale.setScalar(s);

            scene.add(mesh);
            bodies.push({
                mesh,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.003,
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.005,
                ),
                baseScale: s,
                phase: Math.random() * Math.PI * 2,
            });
        }

        // ── 波の接続線 ──
        const connections: WaveConnection[] = [];
        const waveMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });

        // 事前にすべてのペアの Line を生成（非表示にしておく）
        for (let i = 0; i < GEOMETRY_COUNT; i++) {
            for (let j = i + 1; j < GEOMETRY_COUNT; j++) {
                const posAttr = new THREE.BufferAttribute(
                    new Float32Array(WAVE_SEGMENTS * 3),
                    3,
                );
                const colAttr = new THREE.BufferAttribute(
                    new Float32Array(WAVE_SEGMENTS * 3),
                    3,
                );
                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", posAttr);
                geo.setAttribute("color", colAttr);

                const line = new THREE.Line(geo, waveMat);
                line.visible = false;
                line.frustumCulled = false;
                scene.add(line);
                connections.push({ line, from: i, to: j });
            }
        }

        // ── リップル（放射波紋） ──
        const ripples: Ripple[] = [];
        for (let i = 0; i < RIPPLE_COUNT; i++) {
            const ringGeo = new THREE.RingGeometry(0.05, 0.12, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: CYAN,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.visible = false;
            scene.add(ring);
            ripples.push({ ring, birth: 0, active: false });
        }

        // ── 干渉フィールド（背景シェーダー平面） ──
        const fieldGeo = new THREE.PlaneGeometry(40, 25, 1, 1);
        const fieldMat = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                varying vec2 vUv;

                void main() {
                    vec2 p = (vUv - 0.5) * 2.0;

                    // マウス位置からの電磁波
                    float d1 = length(p - uMouse * 1.5);
                    float wave1 = sin(d1 * 12.0 - uTime * 2.5) * 0.5 + 0.5;

                    // 固定ソースからの波
                    float d2 = length(p - vec2(0.6, 0.3));
                    float wave2 = sin(d2 * 10.0 - uTime * 1.8) * 0.5 + 0.5;

                    float d3 = length(p - vec2(-0.5, -0.4));
                    float wave3 = sin(d3 * 8.0 - uTime * 2.2) * 0.5 + 0.5;

                    // 干渉パターン
                    float interference = wave1 * wave2 * wave3;
                    interference = pow(interference, 2.0);

                    // THz風の色: シアン→パープル
                    vec3 cyan = vec3(0.024, 0.714, 0.831);
                    vec3 purple = vec3(0.545, 0.361, 0.965);
                    vec3 col = mix(cyan, purple, sin(uTime * 0.3 + d1) * 0.5 + 0.5);

                    float alpha = interference * 0.06;

                    // 端のフェード
                    float edge = smoothstep(0.0, 0.3, 1.0 - max(abs(p.x), abs(p.y)));
                    alpha *= edge;

                    gl_FragColor = vec4(col, alpha);
                }
            `,
        });
        const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
        fieldMesh.position.z = -5;
        scene.add(fieldMesh);

        // ── イベントハンドラ ──
        const onMouseMove = (e: MouseEvent) => {
            mouseNDC.current.set(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
            );
        };

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onResize);

        // ── レイキャスト用の平面 ──
        const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();

        // ── アニメーションループ ──
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();
            const dt = clock.getDelta();

            // マウス速度の計算
            const dx = mouseNDC.current.x - prevMouseNDC.current.x;
            const dy = mouseNDC.current.y - prevMouseNDC.current.y;
            mouseSpeed.current = Math.sqrt(dx * dx + dy * dy);
            prevMouseNDC.current.copy(mouseNDC.current);

            // マウスのワールド座標
            raycaster.setFromCamera(mouseNDC.current, camera);
            raycaster.ray.intersectPlane(mousePlane, mouseWorld.current);

            // ── 干渉フィールド更新 ──
            fieldMat.uniforms.uTime.value = time;
            fieldMat.uniforms.uMouse.value.set(
                mouseNDC.current.x,
                mouseNDC.current.y,
            );

            // ── 浮遊ジオメトリ更新 ──
            bodies.forEach((body, idx) => {
                const { mesh, velocity, rotationSpeed } = body;

                // 自転
                mesh.rotation.x += rotationSpeed.x;
                mesh.rotation.y += rotationSpeed.y;
                mesh.rotation.z += rotationSpeed.z;

                // 浮遊（ゆっくりブラウン運動 + 浮遊感）
                mesh.position.add(velocity);
                mesh.position.y += Math.sin(time * 0.5 + body.phase) * 0.002;

                // 境界で反射
                const bounds = { x: 10, y: 6, z: 4 };
                if (Math.abs(mesh.position.x) > bounds.x) velocity.x *= -1;
                if (Math.abs(mesh.position.y) > bounds.y) velocity.y *= -1;
                if (Math.abs(mesh.position.z) > bounds.z) velocity.z *= -1;

                // マウスとの距離
                const distToMouse = mesh.position.distanceTo(mouseWorld.current);
                const mat = mesh.material as THREE.MeshStandardMaterial;

                if (distToMouse < MOUSE_INFLUENCE) {
                    // 共鳴: 近いほど発光・回転加速・拡大
                    const influence = 1 - distToMouse / MOUSE_INFLUENCE;
                    const glow = 0.4 + influence * 1.5;
                    mat.emissiveIntensity = glow;
                    mat.opacity = 0.6 + influence * 0.4;

                    // 回転加速
                    mesh.rotation.x += rotationSpeed.x * influence * 4;
                    mesh.rotation.y += rotationSpeed.y * influence * 4;

                    // スケールパルス
                    const pulse = 1 + influence * 0.3 * Math.sin(time * 4 + idx);
                    mesh.scale.setScalar(body.baseScale * pulse);

                    // マウスに軽く引き寄せ
                    const attract = new THREE.Vector3()
                        .subVectors(mouseWorld.current, mesh.position)
                        .normalize()
                        .multiplyScalar(influence * 0.003);
                    velocity.add(attract);
                } else {
                    mat.emissiveIntensity = 0.4;
                    mat.opacity = 0.6;
                    mesh.scale.lerp(
                        new THREE.Vector3().setScalar(body.baseScale),
                        0.02,
                    );
                }

                // 速度減衰
                velocity.multiplyScalar(0.998);
            });

            // ── 波の接続線更新 ──
            connections.forEach((conn) => {
                const posA = bodies[conn.from].mesh.position;
                const posB = bodies[conn.to].mesh.position;
                const dist = posA.distanceTo(posB);

                if (dist < CONNECTION_DIST && dist > 0.5) {
                    conn.line.visible = true;

                    // マウスに近いほど高周波
                    const midPoint = new THREE.Vector3()
                        .addVectors(posA, posB)
                        .multiplyScalar(0.5);
                    const distToMouse = midPoint.distanceTo(mouseWorld.current);
                    const mouseInfluence = Math.max(
                        0,
                        1 - distToMouse / MOUSE_INFLUENCE,
                    );

                    const freq = 1.5 + mouseInfluence * 4; // 近い=高周波(THz的)
                    const amp = 0.08 + mouseInfluence * 0.15;

                    const positions = buildWavePositions(
                        posA,
                        posB,
                        time,
                        freq,
                        amp,
                    );
                    const posAttr = conn.line.geometry.getAttribute(
                        "position",
                    ) as THREE.BufferAttribute;
                    posAttr.set(positions);
                    posAttr.needsUpdate = true;

                    // 色: 距離→エネルギー遷移（シアン=近い=高エネルギー、パープル=遠い）
                    const colAttr = conn.line.geometry.getAttribute(
                        "color",
                    ) as THREE.BufferAttribute;
                    const colors = colAttr.array as Float32Array;

                    for (let k = 0; k < WAVE_SEGMENTS; k++) {
                        const t = k / (WAVE_SEGMENTS - 1);
                        const fade = Math.sin(t * Math.PI); // 端フェード
                        const energyMix =
                            (1 - dist / CONNECTION_DIST) * 0.7 +
                            mouseInfluence * 0.3;
                        const c = new THREE.Color().lerpColors(
                            PURPLE,
                            CYAN,
                            energyMix,
                        );
                        colors[k * 3] = c.r * fade;
                        colors[k * 3 + 1] = c.g * fade;
                        colors[k * 3 + 2] = c.b * fade;
                    }
                    colAttr.needsUpdate = true;

                    // 線の太さは WebGL では 1px 固定なので opacity で強弱を表現
                    (conn.line.material as THREE.LineBasicMaterial).opacity =
                        0.3 + mouseInfluence * 0.5;
                } else {
                    conn.line.visible = false;
                }
            });

            // ── リップル（THz放射波紋） ──
            // マウスが動いていたら新しいリップルを生成
            if (
                mouseSpeed.current > 0.005 &&
                time - lastRippleTime.current > 0.3
            ) {
                const free = ripples.find((r) => !r.active);
                if (free) {
                    free.active = true;
                    free.birth = time;
                    free.ring.visible = true;
                    free.ring.position.copy(mouseWorld.current);
                    free.ring.position.z = 0.1;
                    // ドップラー効果: マウス速度で色変化
                    const mat = free.ring.material as THREE.MeshBasicMaterial;
                    mat.color.lerpColors(
                        CYAN,
                        PURPLE,
                        Math.min(mouseSpeed.current * 10, 1),
                    );
                    lastRippleTime.current = time;
                }
            }

            ripples.forEach((ripple) => {
                if (!ripple.active) return;
                const age = time - ripple.birth;
                const maxAge = 2.5;

                if (age > maxAge) {
                    ripple.active = false;
                    ripple.ring.visible = false;
                    return;
                }

                const progress = age / maxAge;
                const scale = 0.5 + progress * 6;
                ripple.ring.scale.setScalar(scale);

                const mat = ripple.ring.material as THREE.MeshBasicMaterial;
                mat.opacity = (1 - progress) * 0.35;

                // 近くの図形をパルスさせる（吸収・散乱イメージ）
                bodies.forEach((body) => {
                    const dist = body.mesh.position.distanceTo(
                        ripple.ring.position,
                    );
                    const rippleRadius = scale * 0.3;
                    if (
                        Math.abs(dist - rippleRadius) < 0.5 &&
                        progress < 0.8
                    ) {
                        const bMat =
                            body.mesh.material as THREE.MeshStandardMaterial;
                        bMat.emissiveIntensity = Math.min(
                            bMat.emissiveIntensity + 0.3,
                            3,
                        );
                    }
                });
            });

            // ── カメラのパララックス ──
            camera.position.x +=
                (mouseNDC.current.x * 1.5 - camera.position.x) * 0.02;
            camera.position.y +=
                (mouseNDC.current.y * 1.0 - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        // ── クリーンアップ ──
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            container.removeChild(renderer.domElement);

            // ジオメトリ・マテリアル解放
            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach((m) => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
