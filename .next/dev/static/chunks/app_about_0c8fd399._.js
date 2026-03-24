(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/about/HeroText.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const vert = /* glsl */ `
  uniform vec2  uMouse;
  uniform float uHover;
  uniform float uAspect;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec2 acDelta = (uv - uMouse) * vec2(uAspect, 1.0);
    float dist   = length(acDelta);

    float infl = exp(-dist * dist * 6.0) * uHover;

    vec2 dir  = dist > 0.001 ? acDelta / dist : vec2(0.0);
    float mag = infl * 0.2;

    pos.x += (dir.x / uAspect) * mag;
    pos.y += dir.y * mag;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uTex, vUv);
  }
`;
const HERO_TEXT = "Francis Oliver \u2014";
function HeroText() {
    _s();
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const h1Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroText.useEffect": ()=>{
            let alive = true;
            let teardown = null;
            ({
                "HeroText.useEffect": async ()=>{
                    await document.fonts.ready;
                    if (!alive) return;
                    const wrap = wrapRef.current;
                    const h1 = h1Ref.current;
                    const canvas = canvasRef.current;
                    if (!wrap || !h1 || !canvas) return;
                    const measure = {
                        "HeroText.useEffect.measure": ()=>{
                            const rect = h1.getBoundingClientRect();
                            const dpr = devicePixelRatio || 1;
                            return {
                                rect,
                                dpr,
                                W: Math.max(1, Math.round(rect.width * dpr)),
                                H: Math.max(1, Math.round(rect.height * dpr)),
                                aspect: rect.width && rect.height ? rect.width / rect.height : 1
                            };
                        }
                    }["HeroText.useEffect.measure"];
                    const { rect } = measure();
                    let { dpr, W, H, aspect } = measure();
                    if (!rect.width || !rect.height) return;
                    /* ── offscreen text canvas ── */ const off = document.createElement("canvas");
                    off.width = W;
                    off.height = H;
                    const ctx = off.getContext("2d");
                    const drawText = {
                        "HeroText.useEffect.drawText": (r, d)=>{
                            const cs = getComputedStyle(h1);
                            const text = cs.textTransform === "uppercase" ? HERO_TEXT.toUpperCase() : HERO_TEXT;
                            const ls = parseFloat(cs.letterSpacing) || 0;
                            const padL = parseFloat(cs.paddingLeft) || 0;
                            ctx.setTransform(d, 0, 0, d, 0, 0);
                            ctx.clearRect(0, 0, off.width, off.height);
                            ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                            ctx.fillStyle = cs.color;
                            ctx.textBaseline = "middle";
                            let x = padL;
                            for (const ch of text){
                                ctx.fillText(ch, x, r.height / 2);
                                x += ctx.measureText(ch).width + ls;
                            }
                        }
                    }["HeroText.useEffect.drawText"];
                    drawText(rect, dpr);
                    /* ── Three.js ── */ const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                        canvas,
                        alpha: true,
                        antialias: false
                    });
                    renderer.setSize(W, H, false);
                    renderer.setPixelRatio(1);
                    const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
                    const cam = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrthographicCamera"](-0.5, 0.5, 0.5, -0.5, 0.01, 10);
                    cam.position.z = 1;
                    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](off);
                    tex.minFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearFilter"];
                    tex.magFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearFilter"];
                    const uniforms = {
                        uTex: {
                            value: tex
                        },
                        uMouse: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](-1, -1)
                        },
                        uHover: {
                            value: 0
                        },
                        uAspect: {
                            value: aspect
                        }
                    };
                    const segX = Math.min(200, Math.max(64, Math.round(W / 6)));
                    const segY = Math.min(50, Math.max(10, Math.round(H / 6)));
                    const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](1, 1, segX, segY);
                    const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                        vertexShader: vert,
                        fragmentShader: frag,
                        uniforms,
                        transparent: true
                    });
                    scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geo, mat));
                    h1.style.color = "transparent";
                    /* ── lerp mouse ── */ let tX = -1, tY = -1;
                    const LERP = 0.1;
                    let rafId = 0;
                    const loop = {
                        "HeroText.useEffect.loop": ()=>{
                            rafId = requestAnimationFrame(loop);
                            const m = uniforms.uMouse.value;
                            m.x += (tX - m.x) * LERP;
                            m.y += (tY - m.y) * LERP;
                            renderer.render(scene, cam);
                        }
                    }["HeroText.useEffect.loop"];
                    loop();
                    /* ── UV helper ── */ const toUV = {
                        "HeroText.useEffect.toUV": (e)=>{
                            const r = h1.getBoundingClientRect();
                            return {
                                x: (e.clientX - r.left) / r.width,
                                y: 1 - (e.clientY - r.top) / r.height
                            };
                        }
                    }["HeroText.useEffect.toUV"];
                    /* ── hover events ── */ const onEnter = {
                        "HeroText.useEffect.onEnter": (e)=>{
                            const uv = toUV(e);
                            tX = uniforms.uMouse.value.x = uv.x;
                            tY = uniforms.uMouse.value.y = uv.y;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                                value: 1,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        }
                    }["HeroText.useEffect.onEnter"];
                    const onMove = {
                        "HeroText.useEffect.onMove": (e)=>{
                            const uv = toUV(e);
                            tX = uv.x;
                            tY = uv.y;
                        }
                    }["HeroText.useEffect.onMove"];
                    const onLeave = {
                        "HeroText.useEffect.onLeave": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                                value: 0,
                                duration: 0.45,
                                ease: "power2.inOut",
                                onComplete: {
                                    "HeroText.useEffect.onLeave": ()=>{
                                        tX = uniforms.uMouse.value.x = -1;
                                        tY = uniforms.uMouse.value.y = -1;
                                    }
                                }["HeroText.useEffect.onLeave"]
                            });
                        }
                    }["HeroText.useEffect.onLeave"];
                    wrap.addEventListener("mouseenter", onEnter);
                    wrap.addEventListener("mousemove", onMove);
                    wrap.addEventListener("mouseleave", onLeave);
                    /* ── resize ── */ let resizeRaf = 0;
                    const syncSize = {
                        "HeroText.useEffect.syncSize": ()=>{
                            const m = measure();
                            if (!m.rect.width || !m.rect.height) return;
                            if (m.W !== W || m.H !== H || m.dpr !== dpr) {
                                W = m.W;
                                H = m.H;
                                dpr = m.dpr;
                                aspect = m.aspect;
                                off.width = W;
                                off.height = H;
                                drawText(m.rect, dpr);
                                tex.needsUpdate = true;
                                renderer.setSize(W, H, false);
                                uniforms.uAspect.value = aspect;
                            }
                        }
                    }["HeroText.useEffect.syncSize"];
                    const requestSync = {
                        "HeroText.useEffect.requestSync": ()=>{
                            cancelAnimationFrame(resizeRaf);
                            resizeRaf = requestAnimationFrame(syncSize);
                        }
                    }["HeroText.useEffect.requestSync"];
                    const ro = new ResizeObserver(requestSync);
                    ro.observe(h1);
                    window.addEventListener("resize", requestSync);
                    teardown = ({
                        "HeroText.useEffect": ()=>{
                            cancelAnimationFrame(resizeRaf);
                            cancelAnimationFrame(rafId);
                            ro.disconnect();
                            window.removeEventListener("resize", requestSync);
                            wrap.removeEventListener("mouseenter", onEnter);
                            wrap.removeEventListener("mousemove", onMove);
                            wrap.removeEventListener("mouseleave", onLeave);
                            h1.style.color = "";
                            renderer.dispose();
                            tex.dispose();
                            mat.dispose();
                            geo.dispose();
                        }
                    })["HeroText.useEffect"];
                }
            })["HeroText.useEffect"]();
            return ({
                "HeroText.useEffect": ()=>{
                    alive = false;
                    teardown?.();
                }
            })["HeroText.useEffect"];
        }
    }["HeroText.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapRef,
        className: "relative shrink-0 cursor-default",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                ref: h1Ref,
                className: "px-4 font-semibold uppercase tracking-[-0.07em] text-black text-4xl sm:px-6 sm:text-5xl md:px-8 md:text-6xl lg:px-10 lg:text-8xl xl:text-8xl 2xl:text-[12rem]",
                style: {
                    lineHeight: 1
                },
                children: HERO_TEXT
            }, void 0, false, {
                fileName: "[project]/app/about/HeroText.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "pointer-events-none absolute inset-0"
            }, void 0, false, {
                fileName: "[project]/app/about/HeroText.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/HeroText.tsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
_s(HeroText, "V99BLMxNW8sZr4Zha6+6SKoGUvA=");
_c = HeroText;
var _c;
__turbopack_context__.k.register(_c, "HeroText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/TalkButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TalkButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const spring = {
    type: "spring",
    stiffness: 300,
    damping: 25
};
const ARROW_CLASSES = "flex h-8 w-8 shrink-0 items-center justify-center bg-black text-sm text-white sm:h-9 sm:w-9 sm:text-base xl:h-12 xl:w-12 xl:text-2xl";
const HOVER_DELAY_MS = 140;
function TalkButton() {
    _s();
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasInteracted, setHasInteracted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoverTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleEnter = ()=>{
        if (!hasInteracted) setHasInteracted(true);
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current);
        }
        hoverTimerRef.current = window.setTimeout(()=>{
            setHovered(true);
            hoverTimerRef.current = null;
        }, HOVER_DELAY_MS);
    };
    const handleLeave = ()=>{
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        setHovered(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        transition: spring,
        className: "flex items-center gap-2",
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "popLayout",
                children: hovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    layout: true,
                    initial: {
                        opacity: 0,
                        scale: 0
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        scale: 0
                    },
                    transition: spring,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "#",
                        "aria-label": "Next",
                        className: ARROW_CLASSES,
                        children: ">"
                    }, void 0, false, {
                        fileName: "[project]/app/about/TalkButton.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this)
                }, "arrow-left", false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                layout: "position",
                transition: spring,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "#",
                    className: "inline-flex h-8 items-center justify-center bg-black px-3 text-xs font-medium uppercase tracking-tight text-white sm:h-9 sm:px-4 sm:text-sm xl:h-12 xl:px-5 xl:text-base",
                    children: "TALK WITH ME"
                }, void 0, false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "popLayout",
                children: !hovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    layout: true,
                    initial: hasInteracted ? {
                        opacity: 0,
                        scale: 0
                    } : false,
                    animate: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0,
                        rotate: 360
                    },
                    transition: spring,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "#",
                        "aria-label": "Next",
                        className: ARROW_CLASSES,
                        children: ">"
                    }, void 0, false, {
                        fileName: "[project]/app/about/TalkButton.tsx",
                        lineNumber: 87,
                        columnNumber: 13
                    }, this)
                }, "arrow-right", false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/TalkButton.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(TalkButton, "cNbo2edg6uLHnWWn3rqq2kZ1uT4=");
_c = TalkButton;
var _c;
__turbopack_context__.k.register(_c, "TalkButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/TopRightNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopRightNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TopRightNav({ items, className = "" }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rowRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const activeIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TopRightNav.useMemo[activeIndex]": ()=>Math.max(0, items.findIndex({
                "TopRightNav.useMemo[activeIndex]": (item)=>item.active
            }["TopRightNav.useMemo[activeIndex]"]))
    }["TopRightNav.useMemo[activeIndex]"], [
        items
    ]);
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [markerY, setMarkerY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [markerTurns, setMarkerTurns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const targetIndex = hoveredIndex ?? activeIndex;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            const container = containerRef.current;
            const targetEl = rowRefs.current[targetIndex];
            if (!container || !targetEl) return;
            const cRect = container.getBoundingClientRect();
            const tRect = targetEl.getBoundingClientRect();
            const nextY = tRect.top - cRect.top + tRect.height / 2 - 6; // center a 12px square
            setMarkerY(nextY);
        }
    }["TopRightNav.useEffect"], [
        targetIndex,
        items
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            // Slower, subtler spin per move.
            const spinTimer = window.setTimeout({
                "TopRightNav.useEffect.spinTimer": ()=>{
                    setMarkerTurns({
                        "TopRightNav.useEffect.spinTimer": (prev)=>prev + 0.35
                    }["TopRightNav.useEffect.spinTimer"]);
                }
            }["TopRightNav.useEffect.spinTimer"], 0);
            return ({
                "TopRightNav.useEffect": ()=>window.clearTimeout(spinTimer)
            })["TopRightNav.useEffect"];
        }
    }["TopRightNav.useEffect"], [
        targetIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            const onResize = {
                "TopRightNav.useEffect.onResize": ()=>{
                    const container = containerRef.current;
                    const targetEl = rowRefs.current[targetIndex];
                    if (!container || !targetEl) return;
                    const cRect = container.getBoundingClientRect();
                    const tRect = targetEl.getBoundingClientRect();
                    setMarkerY(tRect.top - cRect.top + tRect.height / 2 - 6);
                }
            }["TopRightNav.useEffect.onResize"];
            window.addEventListener("resize", onResize);
            return ({
                "TopRightNav.useEffect": ()=>window.removeEventListener("resize", onResize)
            })["TopRightNav.useEffect"];
        }
    }["TopRightNav.useEffect"], [
        targetIndex
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Primary",
        className: className,
        onMouseLeave: ()=>setHoveredIndex(null),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: containerRef,
            className: "relative flex flex-col items-end gap-1 sm:gap-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    "aria-hidden": true,
                    className: "pointer-events-none absolute right-0 h-3 w-3 bg-black will-change-transform",
                    style: {
                        transform: `translate3d(0, ${markerY}px, 0) rotate(${markerTurns * 360}deg)`,
                        transition: "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)"
                    }
                }, void 0, false, {
                    fileName: "[project]/app/about/TopRightNav.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                items.map((item, idx)=>{
                    const isHoveredTarget = hoveredIndex === idx;
                    const shouldSlide = isHoveredTarget && !item.active;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: (el)=>{
                            rowRefs.current[idx] = el;
                        },
                        className: "flex items-center justify-end gap-2",
                        onMouseEnter: ()=>setHoveredIndex(idx),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: `inline-block transform-gpu text-right text-xs font-medium uppercase tracking-[-0.04em] sm:text-sm ${item.active ? "font-semibold text-black" : "text-[#979797] hover:text-black"} ${shouldSlide ? "-translate-x-1.5" : "translate-x-0"}`,
                                style: {
                                    willChange: "transform",
                                    transition: "transform 760ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease-out"
                                },
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                className: "h-3 w-3 shrink-0 opacity-0"
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 106,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/app/about/TopRightNav.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/app/about/TopRightNav.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/about/TopRightNav.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(TopRightNav, "+KxUB6XJ1KTMoOHtauhjp50a9kA=");
_c = TopRightNav;
var _c;
__turbopack_context__.k.register(_c, "TopRightNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/about-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$HeroText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/HeroText.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TalkButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/TalkButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TopRightNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/TopRightNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const NAV_ITEMS = [
    {
        label: "FRANCIS OLIVER",
        href: "/about",
        active: true
    },
    {
        label: ".GALLERY",
        href: "/#gallery",
        active: false
    },
    {
        label: "RESUME",
        href: "/resume",
        active: false
    },
    {
        label: "PROJECTS",
        href: "/#projects",
        active: false
    }
];
const INTRO = "Hi! I'm Francis Oliver, a graduating student at STI College. Thanks for stopping by my website. I aspire to create \"Awwwards\"-level websites like this. I specialize in building web applications using Java with Spring Boot. Feel free to reach out if you'd like me to develop a software application for you.";
const SOCIAL_LINKS = [
    {
        label: "INSTAGRAM",
        href: "#"
    },
    {
        label: "GITHUB",
        href: "#"
    },
    {
        label: "LINKEDIN",
        href: "#"
    }
];
function AboutContent() {
    _s();
    const bottomBarRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroTextWrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroMaskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AboutContent.useEffect": ()=>{
            const bottomBar = bottomBarRef.current;
            const heroTextWrap = heroTextWrapRef.current;
            const heroMask = heroMaskRef.current;
            if (!bottomBar || !heroTextWrap || !heroMask) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(bottomBar, {
                scaleY: 0,
                transformOrigin: "bottom center"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(heroMask, {
                scaleX: 0,
                transformOrigin: "left center"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(heroTextWrap, {
                opacity: 0,
                y: 16
            });
            const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline({
                delay: 0.08
            });
            tl.to(bottomBar, {
                scaleY: 1,
                duration: 0.9,
                ease: "expo.out"
            }).to(heroMask, {
                scaleX: 1,
                duration: 0.72,
                ease: "power3.inOut"
            }, "-=0.42").to(heroTextWrap, {
                opacity: 1,
                y: 0,
                duration: 0.46,
                ease: "power2.out"
            }, "+=0.06").to(heroMask, {
                opacity: 0,
                duration: 0.18,
                ease: "power1.out"
            });
            return ({
                "AboutContent.useEffect": ()=>{
                    tl.kill();
                }
            })["AboutContent.useEffect"];
        }
    }["AboutContent.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen flex-col overflow-hidden bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex w-full shrink-0 flex-col px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TopRightNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        items: NAV_ITEMS,
                        className: "absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
                    }, void 0, false, {
                        fileName: "[project]/app/about/about-content.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pl-3 max-w-[calc(100vw-8rem)] sm:pl-4 sm:max-w-none sm:pr-28 md:pr-36 lg:max-w-[min(72rem,calc(100vw-18rem))] lg:pr-48 xl:pr-56",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-32 w-32 shrink-0 overflow-hidden sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-44 lg:w-44 xl:h-72 xl:w-72",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/assets/profile1.webp",
                                        alt: "Francis Oliver",
                                        fill: true,
                                        className: "object-cover grayscale",
                                        sizes: "(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 176px, 288px",
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/about/about-content.tsx",
                                        lineNumber: 89,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/about/about-content.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 sm:self-stretch sm:min-h-40 md:min-h-48 lg:min-h-44 xl:min-h-72",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "max-w-5xl leading-snug tracking-[-0.04em] text-black lg:max-w-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-lg xl:leading-relaxed xl:tracking-[-0.08em]",
                                            children: INTRO
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/about-content.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TalkButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/about/about-content.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-3 sm:mt-auto sm:gap-4 xl:gap-6",
                                            children: SOCIAL_LINKS.map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: href,
                                                    className: "relative text-[0.65rem] font-medium uppercase tracking-tight text-black sm:text-xs xl:text-sm after:absolute after:left-0 after:top-[calc(100%+2px)] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100",
                                                    children: label
                                                }, label, false, {
                                                    fileName: "[project]/app/about/about-content.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/about-content.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/about/about-content.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/about/about-content.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/about/about-content.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/about/about-content.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-8 flex-1"
            }, void 0, false, {
                fileName: "[project]/app/about/about-content.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative shrink-0 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: heroTextWrapRef,
                        className: "relative z-10 w-fit",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$HeroText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/about/about-content.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/about/about-content.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: heroMaskRef,
                        className: "pointer-events-none absolute bottom-0 left-0 z-20 h-full w-full bg-black",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/app/about/about-content.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/about/about-content.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                ref: bottomBarRef,
                className: "w-full shrink-0 bg-black",
                style: {
                    height: "30vh"
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/app/about/about-content.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/about-content.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(AboutContent, "2+KATlcb+EnEtB8H8BudYsk5EWI=");
_c = AboutContent;
var _c;
__turbopack_context__.k.register(_c, "AboutContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_about_0c8fd399._.js.map