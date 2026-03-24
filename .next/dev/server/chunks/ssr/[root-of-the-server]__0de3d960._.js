module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/PixelShaderOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PixelShaderOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-ssr] (ecmascript) <locals>");
"use client";
;
;
;
;
/* ── GLSL ──────────────────────────────────────────────────────── */ const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
/*
 * Sub-letter pixel-shader + stretch:
 *
 *   The STRETCH is achieved by making pixel blocks ANISOTROPIC — elongated
 *   radially away from the cursor, normal in the perpendicular direction.
 *   Crucially, UV sampling always happens at the block's own position (no
 *   displacement toward/away from cursor), so transparent areas never
 *   accidentally sample letter pixels and create a bloom/glow artefact.
 *
 *   All quantisation is done in canvas-pixel space so the block sizes are
 *   consistent in screen pixels regardless of canvas aspect ratio.
 */ const frag = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform float     uHover;
  uniform vec2      uMouseUV;  /* lerped cursor — UV (0-1), Y flipped for WebGL */
  uniform vec2      uAnchorUV; /* hovered character anchor UV (0-1)              */
  uniform float     uAspect;   /* width / height — makes Gaussian circular       */
  uniform vec2      uRes;
  varying vec2      vUv;

  void main() {
    /* ── aspect-corrected Gaussian → circular influence in screen space ── */
    vec2  dAC   = (vUv - uMouseUV) * vec2(uAspect, 1.0);
    float gauss  = exp(-dot(dAC, dAC) * 10.0);
    float effect = gauss * uHover;

    if (effect < 0.02) { gl_FragColor = vec4(0.0); return; }

    /* ── localized "pull" so only the hovered character deforms ── */
    vec2  anchor = (uAnchorUV.x < 0.0) ? uMouseUV : uAnchorUV;
    vec2  dPullAC = (vUv - anchor) * vec2(uAspect, 1.0);
    float pull  = exp(-dot(dPullAC, dPullAC) * 34.0) * uHover;

    /* IMPORTANT: warp direction is relative to the hovered letter anchor,
       so only that letter region gets "pulled", not the whole word. */
    vec2  warpUv = vUv - (vUv - anchor) * (0.12 * pull);

    /* ── magnify effect (local zoom) around hovered letter ── */
    float mag = 1.0 + 0.45 * pull;         /* max ~1.45x */
    vec2  magUv = anchor + (warpUv - anchor) / mag;
    magUv = clamp(magUv, 0.0, 1.0);

    /* ── radial + perpendicular axes in canvas-pixel space ── */
    vec2  uvPx  = magUv * uRes;
    vec2  rawPx = uvPx - uMouseUV * uRes;
    float lenPx = length(rawPx) + 0.001;
    vec2  sDir  = rawPx / lenPx;               /* unit radial direction   */
    vec2  pDir  = vec2(-sDir.y, sDir.x);       /* unit perpendicular       */

    /* ── anisotropic block size:
         radially elongated (stretch look), normal perpendicularly ── */
    float basePx   = mix(1.0, 9.0,  smoothstep(0.0, 0.85, effect));
    float radialPx = mix(basePx, basePx * 2.8, smoothstep(0.0, 1.0, effect));

    /* project uvPx onto rotated axes, quantise independently, reconstruct */
    float pR  = dot(uvPx, sDir);
    float pP  = dot(uvPx, pDir);
    vec2  blk = (floor(pR / radialPx) + 0.5) * radialPx * sDir
              + (floor(pP / basePx  ) + 0.5) * basePx   * pDir;
    vec2  pixUv = clamp(blk / uRes, 0.0, 1.0);

    /* ── directional chromatic aberration (subtle) ── */
    vec2  sDirUV = normalize(vec2(sDir.x / uRes.x, sDir.y / uRes.y));
    vec2  ca     = sDirUV * effect * 0.004;
    float r = texture2D(uTex, clamp(pixUv + ca, 0.0, 1.0)).r;
    float g = texture2D(uTex, pixUv).g;
    float b = texture2D(uTex, clamp(pixUv - ca, 0.0, 1.0)).b;
    float a = texture2D(uTex, pixUv).a;

    /* alpha = texture alpha × Gaussian → soft edge, self-masking on glyph */
    gl_FragColor = vec4(r, g, b, a * effect);
  }
`;
function PixelShaderOverlay({ targetRef, displayText, enabled = true }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        if (!enabled) return;
        async function init() {
            await document.fonts.ready;
            if (!mounted) return;
            const targetEl = targetRef.current;
            const canvasEl = canvasRef.current;
            if (!targetEl || !canvasEl) return;
            const target = targetEl;
            const canvas = canvasEl;
            function measure() {
                const rect = target.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                const W = Math.max(1, Math.round(rect.width * dpr));
                const H = Math.max(1, Math.round(rect.height * dpr));
                const aspect = rect.width && rect.height ? rect.width / rect.height : 1;
                return {
                    rect,
                    dpr,
                    W,
                    H,
                    aspect
                };
            }
            const initial = measure();
            let dpr = initial.dpr;
            let W = initial.W;
            let H = initial.H;
            let aspect = initial.aspect;
            const rect = initial.rect;
            if (!rect.width || !rect.height) return;
            /* ── position fixed overlay exactly over the target ── */ function applyPosition(r) {
                canvas.style.left = `${r.left}px`;
                canvas.style.top = `${r.top}px`;
                canvas.style.width = `${r.width}px`;
                canvas.style.height = `${r.height}px`;
            }
            applyPosition(rect);
            /* ── text texture (offscreen 2-D canvas) ── */ const off = document.createElement("canvas");
            off.width = W;
            off.height = H;
            const ctx = off.getContext("2d");
            function drawText(r, dprNow) {
                const cs = window.getComputedStyle(target);
                const text = cs.textTransform === "uppercase" ? displayText.toUpperCase() : displayText;
                const lsPx = parseFloat(cs.letterSpacing) || 0;
                ctx.setTransform(dprNow, 0, 0, dprNow, 0, 0);
                ctx.clearRect(0, 0, off.width, off.height);
                ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                ctx.fillStyle = cs.color;
                ctx.textBaseline = "middle";
                let x = 0;
                for (const ch of text){
                    ctx.fillText(ch, x, r.height / 2);
                    x += ctx.measureText(ch).width + lsPx;
                }
            }
            drawText(rect, dpr);
            /* ── Three.js renderer ── */ const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                canvas,
                alpha: true,
                antialias: false
            });
            renderer.setSize(W, H);
            renderer.setPixelRatio(1);
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Scene"]();
            const cam = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrthographicCamera"](-0.5, 0.5, 0.5, -0.5, 0.01, 10);
            cam.position.z = 1;
            const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](off);
            /* ── uniforms ── */ /* mouse starts off-canvas so no effect before first hover */ const uniforms = {
                uTex: {
                    value: tex
                },
                uHover: {
                    value: 0
                },
                uMouseUV: {
                    value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](-1, -1)
                },
                uAnchorUV: {
                    value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](-1, -1)
                },
                uAspect: {
                    value: aspect
                },
                uRes: {
                    value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](W, H)
                }
            };
            const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                vertexShader: vert,
                fragmentShader: frag,
                uniforms,
                transparent: true
            });
            const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1, 1);
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo, mat));
            /* ── lerp targets for smooth mouse trailing ── */ let tX = -1, tY = -1;
            let lastUvX = -1, lastUvY = -1;
            let charStartsPx = [];
            let charCentersPx = [];
            let charChars = [];
            /* lerp speed — lower = dreamier trail, higher = snappier */ const LERP = 0.14;
            let rafId = 0;
            const loop = ()=>{
                rafId = requestAnimationFrame(loop);
                uniforms.uMouseUV.value.x += (tX - uniforms.uMouseUV.value.x) * LERP;
                uniforms.uMouseUV.value.y += (tY - uniforms.uMouseUV.value.y) * LERP;
                renderer.render(scene, cam);
            };
            loop();
            /* ── keep overlay responsive to layout changes ── */ let resizeRaf = 0;
            function syncToTarget() {
                const m = measure();
                if (!m.rect.width || !m.rect.height) return;
                // Always keep position in sync (scroll/layout shifts)
                applyPosition(m.rect);
                const sizeChanged = m.W !== W || m.H !== H || m.dpr !== dpr;
                if (sizeChanged) {
                    W = m.W;
                    H = m.H;
                    dpr = m.dpr;
                    aspect = m.aspect;
                    off.width = W;
                    off.height = H;
                    drawText(m.rect, dpr);
                    tex.needsUpdate = true;
                    renderer.setSize(W, H, false);
                    uniforms.uRes.value.set(W, H);
                    uniforms.uAspect.value = aspect;
                    // Font size / spacing can change at breakpoints, so recompute anchors.
                    computeCharMetrics();
                    if (uniforms.uHover.value > 0 && lastUvX >= 0 && lastUvY >= 0) {
                        const a = pickAnchorUv({
                            x: lastUvX,
                            y: lastUvY
                        }, m.rect);
                        uniforms.uAnchorUV.value.set(a.x, a.y);
                    }
                    // If we resize while hovered, ensure mouse stays stable
                    if (uniforms.uHover.value > 0) {
                        tX = Math.min(1, Math.max(0, tX));
                        tY = Math.min(1, Math.max(0, tY));
                    }
                }
            }
            function requestSync() {
                cancelAnimationFrame(resizeRaf);
                resizeRaf = requestAnimationFrame(syncToTarget);
            }
            const ro = new ResizeObserver(()=>requestSync());
            ro.observe(target);
            window.addEventListener("resize", requestSync);
            window.addEventListener("scroll", requestSync, true);
            /* ── UV conversion helper ── */ function toUV(e) {
                const r = target.getBoundingClientRect();
                return {
                    x: (e.clientX - r.left) / r.width,
                    y: 1.0 - (e.clientY - r.top) / r.height
                };
            }
            function computeCharMetrics() {
                // Prefer real DOM char spans if present (more accurate than measuring text widths).
                // `page.tsx` renders FULL-STACK with `.hero-title-char` per character.
                const domChars = Array.from(target.querySelectorAll(".hero-title-char"));
                if (domChars.length) {
                    const targetRect = target.getBoundingClientRect();
                    charStartsPx = [];
                    charCentersPx = [];
                    charChars = domChars.map((el)=>el.textContent ?? "");
                    for (const el of domChars){
                        const r = el.getBoundingClientRect();
                        const start = r.left - targetRect.left;
                        const center = start + r.width / 2;
                        charStartsPx.push(start);
                        charCentersPx.push(center);
                    }
                    return;
                }
                const cs = window.getComputedStyle(target);
                const text = cs.textTransform === "uppercase" ? displayText.toUpperCase() : displayText;
                const chars = [
                    ...text
                ];
                const lsPx = parseFloat(cs.letterSpacing) || 0;
                // Measure in CSS pixels
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                const starts = [];
                const centers = [];
                let x = 0;
                for (const ch of chars){
                    const w = ctx.measureText(ch).width;
                    starts.push(x);
                    centers.push(x + w / 2);
                    x += w + lsPx;
                }
                charStartsPx = starts;
                charCentersPx = centers;
                charChars = chars;
            }
            function pickAnchorUv(uv, r) {
                if (!charCentersPx.length) computeCharMetrics();
                const xPx = uv.x * r.width;
                let idx = 0;
                while(idx + 1 < charStartsPx.length && charStartsPx[idx + 1] <= xPx)idx++;
                // If hovering a space, bias to nearest non-space char.
                if (charChars[idx] === " " || charChars[idx] === "\u00A0") {
                    let left = idx - 1;
                    let right = idx + 1;
                    while(left >= 0 || right < charChars.length){
                        if (left >= 0 && charChars[left] !== " " && charChars[left] !== "\u00A0") {
                            idx = left;
                            break;
                        }
                        if (right < charChars.length && charChars[right] !== " " && charChars[right] !== "\u00A0") {
                            idx = right;
                            break;
                        }
                        left--;
                        right++;
                    }
                }
                const cx = charCentersPx[idx] / r.width;
                return {
                    x: cx,
                    y: uv.y
                };
            }
            /* ── hover events — DOM text is never touched ── */ const onEnter = (e)=>{
                const uv = toUV(e);
                /* snap lerped position to cursor so no slide-in from off-canvas */ tX = uniforms.uMouseUV.value.x = uv.x;
                tY = uniforms.uMouseUV.value.y = uv.y;
                lastUvX = uv.x;
                lastUvY = uv.y;
                const r = target.getBoundingClientRect();
                const a = pickAnchorUv(uv, r);
                uniforms.uAnchorUV.value.set(a.x, a.y);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                    value: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            };
            const onMove = (e)=>{
                const uv = toUV(e);
                /* update lerp target — position trails smoothly behind cursor */ tX = uv.x;
                tY = uv.y;
                lastUvX = uv.x;
                lastUvY = uv.y;
                const r = target.getBoundingClientRect();
                const a = pickAnchorUv(uv, r);
                uniforms.uAnchorUV.value.set(a.x, a.y);
            };
            const onLeave = ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                    value: 0,
                    duration: 0.25,
                    ease: "power2.inOut",
                    onComplete: ()=>{
                        /* park off-canvas so next mouseenter snaps cleanly */ tX = uniforms.uMouseUV.value.x = -1;
                        tY = uniforms.uMouseUV.value.y = -1;
                        uniforms.uAnchorUV.value.set(-1, -1);
                    }
                });
            };
            target.addEventListener("mouseenter", onEnter);
            target.addEventListener("mousemove", onMove);
            target.addEventListener("mouseleave", onLeave);
            cleanupRef.current = ()=>{
                cancelAnimationFrame(resizeRaf);
                cancelAnimationFrame(rafId);
                ro.disconnect();
                window.removeEventListener("resize", requestSync);
                window.removeEventListener("scroll", requestSync, true);
                target.removeEventListener("mouseenter", onEnter);
                target.removeEventListener("mousemove", onMove);
                target.removeEventListener("mouseleave", onLeave);
                renderer.dispose();
                tex.dispose();
                mat.dispose();
                geo.dispose();
            };
        }
        init();
        return ()=>{
            mounted = false;
            cleanupRef.current?.();
        };
    }, [
        displayText,
        targetRef,
        enabled
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "pointer-events-none fixed z-20"
    }, void 0, false, {
        fileName: "[project]/app/components/PixelShaderOverlay.tsx",
        lineNumber: 413,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PixelShaderOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/PixelShaderOverlay.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function formatTime(date) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}
const SPLIT_TEXT = "FRANCIS OLIVER";
const HERO_TITLE = "Full-Stack";
const HERO_PARA = "Information Technology student driven by a deep curiosity for technology and its potential to solve real-world challenges. Throughout my academic journey, I\u2019ve built a strong foundation in programming and system development, while actively exploring emerging technologies to continuously expand my skills.";
const HERO_PARA_WORDS = HERO_PARA.split(" ");
const NAV_HEIGHT_REM = 3;
const NAV_MARGIN_REM = 9;
const SHRUNK_RECT_WIDTH_REM = 16;
function Home() {
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showLanding, setShowLanding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shaderEnabled, setShaderEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Overlay
    const overlayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const blackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const francisBlockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Landing
    const heroRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroTitleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroParagraphRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const developerH2Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bottomLeftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bottomRightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Clock
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Avoid SSR/CSR hydration mismatches by only rendering the clock after mount.
        const initialId = window.setTimeout(()=>setNow(new Date()), 0);
        const id = window.setInterval(()=>setNow(new Date()), 1000);
        return ()=>{
            window.clearTimeout(initialId);
            window.clearInterval(id);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const black = blackRef.current;
        const textContainer = textContainerRef.current;
        const overlay = overlayRef.current;
        const francisBlock = francisBlockRef.current;
        if (!black || !textContainer || !overlay || !francisBlock) return;
        const rem = 16;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const navH = NAV_HEIGHT_REM * rem;
        const shrunkW = Math.min(SHRUNK_RECT_WIDTH_REM * rem, vw - NAV_MARGIN_REM * rem);
        const topPx = (vh - navH) / 2;
        const leftPx = (vw - shrunkW) / 2;
        const shrunkClip = `inset(${topPx}px ${leftPx}px ${topPx}px ${leftPx}px)`;
        // ── Overlay initial states
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(black, {
            clipPath: "inset(0px 0px 0px 0px)"
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(textContainer, {
            opacity: 0,
            clipPath: shrunkClip
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(francisBlock, {
            left: vw / 2,
            xPercent: -50
        });
        // ── Landing initial states (hidden under z-100 overlay until Phase 3)
        const hero = heroRef.current;
        const nav = navRef.current;
        const titleChars = heroTitleRef.current?.querySelectorAll(".hero-title-char");
        const paraWords = heroParagraphRef.current?.querySelectorAll(".hero-para-word");
        const devChars = developerH2Ref.current?.querySelectorAll(".dev-char-inner");
        if (hero) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(hero, {
            clipPath: "inset(0% 0% 100% 0%)"
        });
        if (nav) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(nav, {
            y: 90,
            opacity: 0,
            rotation: -1.5,
            skewX: 3,
            transformOrigin: "center bottom"
        });
        if (bottomLeftRef.current) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(bottomLeftRef.current, {
            opacity: 0
        });
        if (bottomRightRef.current) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(bottomRightRef.current, {
            opacity: 0
        });
        if (titleChars?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
            ...titleChars
        ], {
            yPercent: 120
        });
        if (paraWords?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
            ...paraWords
        ], {
            yPercent: 120
        });
        // Developer — chars drop from above
        if (devChars?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
            ...devChars
        ], {
            yPercent: -120
        });
        const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
        // ── Phase 1: full-screen black shrinks to narrow centred strip
        tl.to(black, {
            clipPath: shrunkClip,
            duration: 1.2,
            ease: "expo.inOut"
        });
        // ── Phase 2: FRANCIS OLIVER mask-split
        tl.to(textContainer, {
            opacity: 1,
            duration: 0.15
        }, "-=0.1");
        const francisInners = textContainer.querySelectorAll(".startup-francis .startup-char-inner");
        tl.fromTo(francisInners, {
            yPercent: 110,
            skewX: 12
        }, {
            yPercent: 0,
            skewX: 0,
            duration: 0.6,
            stagger: 0.045,
            ease: "expo.out"
        }, "-=0.05");
        // ── Phase 3: rectangle slides down past the screen (0.35s pause first)
        tl.to(overlay, {
            y: vh + navH * 2,
            duration: 0.9,
            ease: "power3.inOut"
        }, "+=0.35");
        tl.call(()=>{
            setShowLanding(true);
            // Keep shader disabled until hero text is actually revealed.
            setShaderEnabled(false);
        }, undefined, "<");
        // ── Phase 4: hero black section sweeps down from top — fluid deceleration
        if (hero) {
            tl.to(hero, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.3,
                ease: "expo.out"
            }, "-=0.2");
        }
        // ── Phase 4b + 4d + nav: "FULL-STACK", "Developer —", and nav all start together
        tl.addLabel("heroText", "-=0.55");
        if (titleChars?.length) {
            tl.fromTo([
                ...titleChars
            ], {
                yPercent: 115,
                skewX: -12,
                rotation: -2
            }, {
                yPercent: 0,
                skewX: 0,
                rotation: 0,
                duration: 0.75,
                stagger: {
                    each: 0.055,
                    ease: "power2.in"
                },
                ease: "expo.out"
            }, "heroText");
        }
        if (devChars?.length) {
            tl.fromTo([
                ...devChars
            ], {
                yPercent: -120,
                skewX: -8
            }, {
                yPercent: 0,
                skewX: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "expo.out"
            }, "heroText");
        }
        if (nav) {
            tl.to(nav, {
                y: 0,
                opacity: 1,
                rotation: 0,
                skewX: 0,
                duration: 1.1,
                ease: "expo.out"
            }, "heroText");
        }
        // ── Phase 4c: paragraph words mask-split — tight cascade
        if (paraWords?.length) {
            tl.fromTo([
                ...paraWords
            ], {
                yPercent: 120,
                skewX: 6
            }, {
                yPercent: 0,
                skewX: 0,
                duration: 0.5,
                stagger: 0.012,
                ease: "expo.out"
            }, "-=0.25");
        }
        // ── Phase 4e: bottom labels fade in
        if (bottomLeftRef.current && bottomRightRef.current) {
            tl.to([
                bottomLeftRef.current,
                bottomRightRef.current
            ], {
                opacity: 1,
                duration: 0.4,
                ease: "power1.out"
            }, "-=0.3");
        }
        // Only enable hover shader once the landing content is visible.
        tl.call(()=>{
            overlay.style.pointerEvents = "none";
            overlay.style.display = "none";
            setShaderEnabled(true);
        });
    }, []);
    const timestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>now ? formatTime(now) : "", [
        now
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen bg-white text-black max-sm:h-screen max-sm:min-h-0 max-sm:overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: overlayRef,
                className: "fixed inset-0 z-[100]",
                "aria-hidden": showLanding,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: blackRef,
                        className: "absolute inset-0 bg-black"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: textContainerRef,
                        className: "absolute inset-0 flex items-center opacity-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: francisBlockRef,
                            className: "startup-francis absolute flex overflow-hidden text-xs font-medium uppercase tracking-tight text-white sm:text-sm lg:text-lg lg:tracking-tighter",
                            children: SPLIT_TEXT.split("").map((char, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "startup-char-wrap inline-block overflow-hidden leading-tight",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "startup-char-inner inline-block",
                                        children: char === " " ? "\u00A0" : char
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: showLanding ? "" : "pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        ref: heroRef,
                        "aria-label": "Hero",
                        className: "absolute inset-x-0 top-0 h-[45vh] bg-black",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                ref: heroParagraphRef,
                                className: "absolute right-4 top-1/2 max-w-xs -translate-y-1/2 text-right text-xs font-regular leading-snug tracking-tight text-white/90 sm:right-6 sm:max-w-sm sm:text-sm md:max-w-md md:text-base lg:right-8 lg:max-w-lg lg:text-base xl:right-10 xl:max-w-xl xl:text-xl xl:tracking-[-0.08em] xl:leading-tight",
                                children: HERO_PARA_WORDS.map((word, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block overflow-hidden",
                                        style: {
                                            verticalAlign: "bottom"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hero-para-word inline-block leading-snug",
                                                children: word
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 17
                                            }, this),
                                            i < HERO_PARA_WORDS.length - 1 && "\u00A0"
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                ref: heroTitleRef,
                                className: "absolute bottom-[-0.08em] left-4 text-4xl font-semibold uppercase tracking-[-0.06em] text-white select-none cursor-default sm:left-6 sm:text-6xl md:left-8 md:text-7xl lg:left-8 lg:text-8xl xl:left-10 xl:text-9xl xl:tracking-[-0.07em]",
                                style: {
                                    lineHeight: 1
                                },
                                children: HERO_TITLE.split("").map((char, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: "inline-block",
                                            overflow: "hidden",
                                            verticalAlign: "bottom",
                                            paddingLeft: "0.09em",
                                            paddingRight: "0.09em",
                                            marginLeft: "-0.09em",
                                            marginRight: "-0.09em"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hero-title-char",
                                            style: {
                                                display: "inline-block"
                                            },
                                            children: char
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 17
                                        }, this)
                                    }, i, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        ref: developerH2Ref,
                        className: "absolute left-3 top-[45vh] -translate-y-2 text-[3.5rem] font-semibold uppercase select-none cursor-default tracking-[-0.06em] text-black sm:left-4 sm:text-[5.5rem] md:left-6 md:text-[9rem] lg:left-6 lg:text-[11em] xl:left-7.5 xl:text-[16em] xl:tracking-[-0.07em]",
                        style: {
                            lineHeight: 1
                        },
                        children: [
                            "Developer\u00A0",
                            "\u2014"
                        ].map((word, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block overflow-hidden",
                                style: {
                                    verticalAlign: "bottom"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "dev-char-inner inline-block",
                                    children: word
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this)
                            }, i, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 292,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    showLanding && shaderEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PixelShaderOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                targetRef: heroTitleRef,
                                displayText: HERO_TITLE
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PixelShaderOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                targetRef: developerH2Ref,
                                displayText: "Developer\u00A0\u2014"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        ref: navRef,
                        "aria-label": "Primary",
                        className: "fixed bottom-16 left-1/2 z-50 flex h-12 w-full max-w-[calc(100vw-6rem)] -translate-x-1/2 items-center bg-black px-4 sm:bottom-8 sm:w-md sm:max-w-[calc(100vw-9rem)] sm:px-8 lg:bottom-10 lg:px-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "flex w-full items-center justify-center gap-4 sm:gap-8 lg:gap-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/about",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: "Francis Oliver"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#projects",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: "Projects"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 336,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#gallery",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block align-baseline text-base leading-none sm:text-lg lg:text-2xl",
                                                children: "."
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 17
                                            }, this),
                                            "Gallery"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 344,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomLeftRef,
                        className: "fixed bottom-3 left-4 z-40 text-xs font-medium tracking-tight text-black sm:bottom-8 sm:left-6 sm:text-sm lg:bottom-10 lg:left-10 lg:tracking-tighter",
                        children: timestamp
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomRightRef,
                        className: "fixed bottom-3 right-4 z-40 text-xs font-medium tracking-tight text-black sm:bottom-8 sm:right-6 sm:text-sm lg:bottom-10 lg:right-10 lg:tracking-tighter",
                        children: "FULL-STACK DEV"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0de3d960._.js.map