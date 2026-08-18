'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cld } from '../lib/cloudinary'

const HOME_DURATION = 4900
const INNER_DURATION = 1100
const BURN_DURATION = 1.65

const PAPER = {
  paper: [0.045, 0.045, 0.045],
  char: [0.02, 0.014, 0.01],
  fire: [6.2, 2.05, 0.1],
  noiseScale: 1.05,
  fireScale: 1.1,
}

const VERTEX_SHADER = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

// Même shader que PageTransitionOverlay : même bruit, braise et disparition.
const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_progress;
uniform float u_time;
uniform vec3 u_paperColor;
uniform vec3 u_charColor;
uniform vec3 u_fireColor;
uniform float u_noiseScale;
uniform float u_fireScale;
float rand(vec2 n) { return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
float noise(vec2 n) {
  const vec2 d = vec2(0., 1.);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
float fbm(vec2 n) {
  float total = 0.0, amplitude = .4;
  for (int i = 0; i < 4; i++) { total += noise(n) * amplitude; n += n; amplitude *= 0.6; }
  return total;
}
void main() {
  vec2 uv = vUv;
  uv.x *= min(1., u_resolution.x / u_resolution.y);
  uv.y *= min(1., u_resolution.y / u_resolution.x);
  float t = u_progress;
  vec3 color = u_paperColor;
  float main_noise = 1. - fbm((.75 * u_noiseScale) * uv + 10. - vec2(.3, .9 * t));
  float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
  color -= u_charColor * paper_darkness;
  vec3 fire_color_val = fbm((6. * u_fireScale) * uv - vec2(0., .005 * u_time)) * u_fireColor;
  float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
  show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));
  float fire_border = .02 * show_fire;
  float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
  fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
  color += fire_color_val * fire_edge;
  float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);
  gl_FragColor = vec4(color, opacity);
}`

function createPaperBurn(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' })
    || canvas.getContext('experimental-webgl')
  if (!gl) return null
  const compile = (source, type) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
  const vertex = compile(VERTEX_SHADER, gl.VERTEX_SHADER)
  const fragment = compile(FRAGMENT_SHADER, gl.FRAGMENT_SHADER)
  if (!vertex || !fragment) return null
  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)
  const uniforms = {}
  for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
    const info = gl.getActiveUniform(program, i)
    uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  return { gl, uniforms }
}

export default function Loader({ onDone, isMobile = false }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const duration = isHome ? HOME_DURATION : INNER_DURATION
  const [progress, setProgress] = useState(0)
  const [present, setPresent] = useState(true)
  const [burning, setBurning] = useState(false)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const ratio = Math.min((now - start) / duration, 1)
      setProgress(Math.round((1 - Math.pow(1 - ratio, 3)) * 100))
      if (ratio < 1) raf = requestAnimationFrame(tick)
      else setBurning(true)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  useEffect(() => {
    if (!burning) return undefined
    const canvas = canvasRef.current
    const content = contentRef.current
    const state = canvas && createPaperBurn(canvas)
    if (!canvas || !state) {
      setPresent(false)
      return undefined
    }
    const { gl, uniforms } = state
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let raf = 0
    const start = performance.now()
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height)
    }
    const draw = (value) => {
      gl.uniform1f(uniforms.u_time, performance.now())
      gl.uniform1f(uniforms.u_progress, value)
      gl.uniform3f(uniforms.u_paperColor, ...PAPER.paper)
      gl.uniform3f(uniforms.u_charColor, ...PAPER.char)
      gl.uniform3f(uniforms.u_fireColor, ...PAPER.fire)
      gl.uniform1f(uniforms.u_noiseScale, PAPER.noiseScale)
      gl.uniform1f(uniforms.u_fireScale, PAPER.fireScale)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = (now) => {
      const ratio = Math.min((now - start) / (BURN_DURATION * 1000), 1)
      const eased = 1 - Math.pow(1 - ratio, 3)
      draw(eased)
      if (ratio < 1) raf = requestAnimationFrame(loop)
      else setPresent(false)
    }
    if (content) content.style.opacity = '0'
    canvas.style.opacity = '1'
    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [burning])

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone?.()
  }

  return (
    <AnimatePresence initial={false} onExitComplete={finish}>
      {present && (
        <motion.div
          className={`aka-loader${isMobile ? ' aka-loader--mobile' : ''}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: 'linear' }}
          role="status"
          aria-live="polite"
          aria-label="Chargement d’AKATech Studio"
        >
          <canvas ref={canvasRef} className="aka-loader-burn-canvas" aria-hidden="true" />
          <div ref={contentRef} className="aka-loader-center">
            <img src={cld('/assets/images/logo-akatech.webp')} alt="AKATech Studio" className="aka-loader-logo" />
            <div className="aka-loader-name">AKATECH</div>
            <div className="aka-loader-progress" aria-label={`${progress}% chargé`}>
              {String(progress).padStart(3, '0')}<span>%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
