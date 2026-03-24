"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ── GLSL ──────────────────────────────────────────────────────── */

const vert = /* glsl */ `
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
 */
const frag = /* glsl */ `
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

/* ── component ─────────────────────────────────────────────────── */

interface Props {
  targetRef: RefObject<HTMLElement | null>;
  /** Raw text — component applies CSS text-transform automatically */
  displayText: string;
  /** If false, shader is not mounted/initialized */
  enabled?: boolean;
  /**
   * When set (e.g. `.char-inner`), glyph positions are taken from those elements so
   * per-letter tracking / split spans match the DOM — same idea as `.hero-title-char` on the landing hero.
   */
  domCharSelector?: string;
}

export default function PixelShaderOverlay({
  targetRef,
  displayText,
  enabled = true,
  domCharSelector,
}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
        return { rect, dpr, W, H, aspect };
      }

      const initial = measure();
      let dpr = initial.dpr;
      let W = initial.W;
      let H = initial.H;
      let aspect = initial.aspect;
      const rect = initial.rect;
      if (!rect.width || !rect.height) return;

      /* ── position fixed overlay exactly over the target ── */
      function applyPosition(r: DOMRect) {
        canvas.style.left = `${r.left}px`;
        canvas.style.top = `${r.top}px`;
        canvas.style.width = `${r.width}px`;
        canvas.style.height = `${r.height}px`;
      }
      applyPosition(rect);

      /* ── text texture (offscreen 2-D canvas) ── */
      const off = document.createElement("canvas");
      off.width  = W;
      off.height = H;
      const ctx  = off.getContext("2d")!;
      function drawText(r: DOMRect, dprNow: number) {
        const cs = window.getComputedStyle(target);
        const text = cs.textTransform === "uppercase" ? displayText.toUpperCase() : displayText;
        const lsPx = parseFloat(cs.letterSpacing) || 0;

        ctx.setTransform(dprNow, 0, 0, dprNow, 0, 0);
        ctx.clearRect(0, 0, off.width, off.height);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.fillStyle = cs.color;
        ctx.textBaseline = "middle";

        if (domCharSelector) {
          const spans = target.querySelectorAll<HTMLElement>(domCharSelector);
          if (spans.length >= text.length) {
            spans.forEach((span, idx) => {
              if (idx >= text.length) return;
              const sr = span.getBoundingClientRect();
              ctx.fillText(
                text[idx]!,
                sr.left - r.left,
                sr.top - r.top + sr.height / 2,
              );
            });
            return;
          }
        }

        const padL = parseFloat(cs.paddingLeft) || 0;
        let x = padL;
        for (const ch of text) {
          ctx.fillText(ch, x, r.height / 2);
          x += ctx.measureText(ch).width + lsPx;
        }
      }
      drawText(rect, dpr);

      /* ── Three.js renderer ── */
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setSize(W, H);
      renderer.setPixelRatio(1);

      const scene = new THREE.Scene();
      const cam   = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
      cam.position.z = 1;

      const tex = new THREE.CanvasTexture(off);

      /* ── uniforms ── */
      /* mouse starts off-canvas so no effect before first hover */
      const uniforms = {
        uTex:      { value: tex },
        uHover:    { value: 0   as number },
        uMouseUV:  { value: new THREE.Vector2(-1, -1) },
        uAnchorUV: { value: new THREE.Vector2(-1, -1) },
        uAspect:   { value: aspect },
        uRes:      { value: new THREE.Vector2(W, H) },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms,
        transparent: true,
      });
      const geo = new THREE.PlaneGeometry(1, 1);
      scene.add(new THREE.Mesh(geo, mat));

      /* ── lerp targets for smooth mouse trailing ── */
      let tX = -1, tY = -1;
      let lastUvX = -1, lastUvY = -1;
      let charStartsPx: number[] = [];
      let charCentersPx: number[] = [];
      let charChars: string[] = [];

      /* lerp speed — lower = dreamier trail, higher = snappier */
      const LERP = 0.14;

      let rafId = 0;
      const loop = () => {
        rafId = requestAnimationFrame(loop);
        uniforms.uMouseUV.value.x += (tX - uniforms.uMouseUV.value.x) * LERP;
        uniforms.uMouseUV.value.y += (tY - uniforms.uMouseUV.value.y) * LERP;
        renderer.render(scene, cam);
      };
      loop();

      /* ── keep overlay responsive to layout changes ── */
      let resizeRaf = 0;
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
            const a = pickAnchorUv({ x: lastUvX, y: lastUvY }, m.rect);
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

      const ro = new ResizeObserver(() => requestSync());
      ro.observe(target);
      window.addEventListener("resize", requestSync);
      window.addEventListener("scroll", requestSync, true);

      /* ── UV conversion helper ── */
      function toUV(e: MouseEvent) {
        const r = target.getBoundingClientRect();
        return {
          x: (e.clientX - r.left) / r.width,
          y: 1.0 - (e.clientY - r.top) / r.height, /* flip Y for WebGL */
        };
      }

      function computeCharMetrics() {
        if (domCharSelector) {
          const domChars = Array.from(
            target.querySelectorAll<HTMLElement>(domCharSelector),
          );
          if (domChars.length) {
            const targetRect = target.getBoundingClientRect();
            charStartsPx = [];
            charCentersPx = [];
            charChars = domChars.map((el) => el.textContent ?? "");
            for (const el of domChars) {
              const box = el.getBoundingClientRect();
              const start = box.left - targetRect.left;
              const center = start + box.width / 2;
              charStartsPx.push(start);
              charCentersPx.push(center);
            }
            return;
          }
        }

        // Prefer real DOM char spans if present (more accurate than measuring text widths).
        // `page.tsx` renders FULL-STACK with `.hero-title-char` per character.
        const domChars = Array.from(target.querySelectorAll<HTMLElement>(".hero-title-char"));
        if (domChars.length) {
          const targetRect = target.getBoundingClientRect();
          charStartsPx = [];
          charCentersPx = [];
          charChars = domChars.map((el) => el.textContent ?? "");
          for (const el of domChars) {
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
        const chars = [...text];
        const lsPx = parseFloat(cs.letterSpacing) || 0;

        // Measure in CSS pixels
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

        const starts: number[] = [];
        const centers: number[] = [];
        let x = 0;
        for (const ch of chars) {
          const w = ctx.measureText(ch).width;
          starts.push(x);
          centers.push(x + w / 2);
          x += w + lsPx;
        }
        charStartsPx = starts;
        charCentersPx = centers;
        charChars = chars;
      }

      function pickAnchorUv(uv: { x: number; y: number }, r: DOMRect) {
        if (!charCentersPx.length) computeCharMetrics();
        const xPx = uv.x * r.width;
        let idx = 0;
        while (idx + 1 < charStartsPx.length && charStartsPx[idx + 1] <= xPx) idx++;

        // If hovering a space, bias to nearest non-space char.
        if (charChars[idx] === " " || charChars[idx] === "\u00A0") {
          let left = idx - 1;
          let right = idx + 1;
          while (left >= 0 || right < charChars.length) {
            if (left >= 0 && charChars[left] !== " " && charChars[left] !== "\u00A0") { idx = left; break; }
            if (right < charChars.length && charChars[right] !== " " && charChars[right] !== "\u00A0") { idx = right; break; }
            left--; right++;
          }
        }

        const cx = charCentersPx[idx] / r.width;
        return { x: cx, y: uv.y };
      }

      /* ── hover events — DOM text is never touched ── */
      const onEnter = (e: MouseEvent) => {
        const uv = toUV(e);
        /* snap lerped position to cursor so no slide-in from off-canvas */
        tX = uniforms.uMouseUV.value.x = uv.x;
        tY = uniforms.uMouseUV.value.y = uv.y;
        lastUvX = uv.x;
        lastUvY = uv.y;
        const r = target.getBoundingClientRect();
        const a = pickAnchorUv(uv, r);
        uniforms.uAnchorUV.value.set(a.x, a.y);
        gsap.killTweensOf(uniforms.uHover);
        gsap.to(uniforms.uHover, { value: 1, duration: 0.2, ease: "power2.out" });
      };

      const onMove = (e: MouseEvent) => {
        const uv = toUV(e);
        /* update lerp target — position trails smoothly behind cursor */
        tX = uv.x;
        tY = uv.y;
        lastUvX = uv.x;
        lastUvY = uv.y;
        const r = target.getBoundingClientRect();
        const a = pickAnchorUv(uv, r);
        uniforms.uAnchorUV.value.set(a.x, a.y);
      };

      const onLeave = () => {
        gsap.killTweensOf(uniforms.uHover);
        gsap.to(uniforms.uHover, {
          value: 0,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            /* park off-canvas so next mouseenter snaps cleanly */
            tX = uniforms.uMouseUV.value.x = -1;
            tY = uniforms.uMouseUV.value.y = -1;
            uniforms.uAnchorUV.value.set(-1, -1);
          },
        });
      };

      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mousemove",  onMove);
      target.addEventListener("mouseleave", onLeave);

      cleanupRef.current = () => {
        cancelAnimationFrame(resizeRaf);
        cancelAnimationFrame(rafId);
        ro.disconnect();
        window.removeEventListener("resize", requestSync);
        window.removeEventListener("scroll", requestSync, true);
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mousemove",  onMove);
        target.removeEventListener("mouseleave", onLeave);
        renderer.dispose();
        tex.dispose();
        mat.dispose();
        geo.dispose();
      };
    }

    init();
    return () => {
      mounted = false;
      cleanupRef.current?.();
    };
  }, [displayText, targetRef, enabled, domCharSelector]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed z-20" />;
}
