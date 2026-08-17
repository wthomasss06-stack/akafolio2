'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'

// Palette "papier brûlé" adaptée à l'identité AKATECH : au lieu des
// 10 variantes du fichier de référence (pensées pour un sélecteur
// visuel), un seul réglage — papier sombre proche du fond du site
// (--bg), braise dans l'orange de la marque (--accent, #FF5500). Pour
// changer d'ambiance, il suffit de modifier ces 5 valeurs : ce sont
// exactement les mêmes uniformes que dans le fichier de référence.
const BURN_THEME = {
  paper: [0.045, 0.045, 0.045],
  char: [0.02, 0.014, 0.01],
  fire: [6.2, 2.05, 0.1],
  noiseScale: 1.05,
  fireScale: 1.1,
}

const TRANSITION_DURATION = 3.8 // combustion rapide et fluide après les 100 %

const VERTEX_SHADER = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;

void main() {
  vUv = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

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

float rand(vec2 n) {
  return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  const vec2 d = vec2(0., 1.);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  float total = 0.0, amplitude = .4;
  for (int i = 0; i < 4; i++) {
    total += noise(n) * amplitude;
    n += n;
    amplitude *= 0.6;
  }
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
}
`

function compileShader(gl, source, type) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('AKATECH transition — erreur de compilation shader :', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initGL(canvas) {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (!gl) return null

  const vertexShader = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('AKATECH transition — erreur de link shader :', gl.getProgramInfoLog(program))
    return null
  }

  const uniforms = {}
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniformCount; i++) {
    const info = gl.getActiveUniform(program, i)
    uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  gl.useProgram(program)
  const positionLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLoc)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  return { gl, uniforms }
}

/**
 * Calque de transition plein écran entre les "pages" internes
 * d'AKATECH (home/story/method/...) : un shader WebGL de "papier
 * brûlé" adapté du fichier de référence (scroll-scrub → ici un tween
 * GSAP déclenché au clic, puisque le changement de page n'est pas lié
 * au scroll dans cette appli).
 *
 * Exposé via ref : transitionRef.current.trigger(swapFn). Séquence :
 *  1. le canvas devient visible avec progress=0 (entièrement opaque,
 *     recouvre tout l'écran) et une image est dessinée immédiatement ;
 *  2. on attend la frame suivante (garantit que ce calque opaque a
 *     bien été peint par le navigateur avant de continuer) ;
 *  3. swapFn() bascule le contenu React pendant qu'il est masqué —
 *     invisible pour la personne qui regarde l'écran ;
 *  4. progress anime 0 → 1 (le "papier" brûle et révèle la nouvelle
 *     page en dessous, avec la lueur de braise orange à la frontière) ;
 *  5. une fois à 1 (entièrement transparent), le calque redevient
 *     invisible et prêt pour la prochaine navigation.
 *
 * Fallback silencieux (appelle juste swapFn) si WebGL est
 * indisponible, si une transition est déjà en cours, ou si la
 * personne préfère moins de mouvement.
 */
const PageTransitionOverlay = forwardRef(function PageTransitionOverlay(_props, ref) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const phaseRef = useRef('idle') // 'idle' | 'active'
  const progressRef = useRef(0)
  const rafRef = useRef(null)

  const drawFrame = useCallback(() => {
    const state = glRef.current
    if (!state) return
    const { gl, uniforms } = state
    gl.uniform1f(uniforms.u_time, performance.now())
    gl.uniform1f(uniforms.u_progress, progressRef.current)
    gl.uniform3f(uniforms.u_paperColor, BURN_THEME.paper[0], BURN_THEME.paper[1], BURN_THEME.paper[2])
    gl.uniform3f(uniforms.u_charColor, BURN_THEME.char[0], BURN_THEME.char[1], BURN_THEME.char[2])
    gl.uniform3f(uniforms.u_fireColor, BURN_THEME.fire[0], BURN_THEME.fire[1], BURN_THEME.fire[2])
    gl.uniform1f(uniforms.u_noiseScale, BURN_THEME.noiseScale)
    gl.uniform1f(uniforms.u_fireScale, BURN_THEME.fireScale)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [])

  const loop = useCallback(() => {
    drawFrame()
    if (phaseRef.current === 'active') {
      rafRef.current = requestAnimationFrame(loop)
    }
  }, [drawFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    glRef.current = initGL(canvas)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      const state = glRef.current
      if (state) {
        state.gl.viewport(0, 0, canvas.width, canvas.height)
        state.gl.uniform2f(state.uniforms.u_resolution, canvas.width, canvas.height)
        drawFrame()
      }
    }
    window.addEventListener('resize', resize)
    resize()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      glRef.current = null
    }
  }, [drawFrame])

  useImperativeHandle(ref, () => ({
    trigger(swapFn) {
      const canvas = canvasRef.current
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!canvas || !glRef.current || reduceMotion || phaseRef.current === 'active') {
        swapFn()
        return
      }

      phaseRef.current = 'active'
      progressRef.current = 0
      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'auto'
      drawFrame() // image entièrement opaque, dessinée avant même le prochain paint du navigateur

      requestAnimationFrame(() => {
        // À ce stade, le calque opaque a déjà été peint à l'écran :
        // la bascule de contenu ci-dessous est invisible.
        swapFn()
        loop()

        // BUG résolu : pointer-events restait 'auto' jusqu'à la toute
        // fin de la combustion — le calque, même
        // redevenu quasi transparent bien avant la fin par le fondu
        // du shader, continuait à intercepter TOUS les clics sur
        // tout l'écran pendant toute l'animation. C'était la vraie
        // cause de "impossible de fermer le modal / de cliquer sur
        // la nav" : les clics n'atteignaient jamais leur cible, ils
        // étaient avalés par ce calque invisible mais toujours actif.
        // Le fondu opaque masque déjà la bascule en un instant ; pas
        // besoin de bloquer les clics plus longtemps que ça.
        window.setTimeout(() => {
          if (canvas) canvas.style.pointerEvents = 'none'
        }, 250)

        const tweenState = { value: 0 }
        gsap.to(tweenState, {
          value: 1,
          duration: TRANSITION_DURATION,
          // power2.inOut avançait à un rythme régulier sur toute la
          // durée — mais le bruit du shader fait que peu de choses
          // sont visibles tant que u_progress n'a pas atteint le
          // seuil de la plupart des pixels : ça se lisait comme une
          // longue "initialisation" avant que le déchirement ne
          // devienne perceptible. expo.out fonce dans cette zone
          // silencieuse puis ralentit fort — la majeure partie des 7s
          // est donnée à la partie qui se voit réellement, pas à
          // l'attente avant.
          ease: 'expo.out',
          onUpdate: () => { progressRef.current = tweenState.value },
          onComplete: () => {
            phaseRef.current = 'idle'
            progressRef.current = 0
            canvas.style.opacity = '0'
            canvas.style.pointerEvents = 'none'
          },
        })
      })
    },
  }), [drawFrame, loop])

  return <canvas ref={canvasRef} className="akatech-transition-canvas" aria-hidden="true" />
})

export default PageTransitionOverlay
