'use client';
import { useEffect, useRef } from 'react';

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 4,
  VELOCITY_DISSIPATION = 2.5,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 4,
  SPLAT_RADIUS = 0.18,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.96, g: 0.96, b: 0.94 },
  TRANSPARENT = true,
}: {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Pointer state ────────────────────────────────────────────────────────

    function pointerPrototype(this: any) {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = { r: 0, g: 0, b: 0 };
    }

    const pointers: any[] = [new (pointerPrototype as any)()];

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR: { ...BACK_COLOR },
      TRANSPARENT,
    };

    // ── WebGL context ────────────────────────────────────────────────────────

    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl: WebGLRenderingContext =
      (canvas.getContext('webgl2', params) ||
        canvas.getContext('webgl', params) ||
        canvas.getContext('experimental-webgl', params)) as WebGLRenderingContext;

    const isWebGL2 = !!(canvas.getContext('webgl2', params));

    let halfFloat: any;
    let supportLinearFiltering: any;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2
      ? (gl as any).HALF_FLOAT
      : halfFloat
      ? halfFloat.HALF_FLOAT_OES
      : gl.UNSIGNED_BYTE;

    function supportRenderTextureFormat(
      internalFormat: number,
      format: number,
      type: number
    ): boolean {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        switch (internalFormat) {
          case (gl as any).R16F:
            return getSupportedFormat((gl as any).RG16F, (gl as any).RG, type);
          case (gl as any).RG16F:
            return getSupportedFormat((gl as any).RGBA16F, gl.RGBA, type);
          default:
            return { internalFormat: gl.RGBA, format: gl.RGBA };
        }
      }
      return { internalFormat, format };
    }

    let formatRGBA: { internalFormat: number; format: number };
    let formatRG: { internalFormat: number; format: number };
    let formatR: { internalFormat: number; format: number };

    if (isWebGL2) {
      formatRGBA = getSupportedFormat((gl as any).RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat((gl as any).RG16F, (gl as any).RG, halfFloatTexType);
      formatR = getSupportedFormat((gl as any).R16F, (gl as any).RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    // ── Shader helpers ───────────────────────────────────────────────────────

    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
      const program = gl.createProgram()!;
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program: WebGLProgram): Record<string, WebGLUniformLocation | null> {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return uniforms;
    }

    // ── GLSL sources ─────────────────────────────────────────────────────────

    const baseVertSrc = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const clearFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `;

    const colorFragSrc = `
      precision mediump float;
      uniform vec4 color;
      void main () { gl_FragColor = color; }
    `;

    const displayFragSrc = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        ${config.SHADING ? `
        float dx = length(texture2D(uTexture, vR).rgb - texture2D(uTexture, vL).rgb);
        float dy = length(texture2D(uTexture, vT).rgb - texture2D(uTexture, vB).rgb);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        float diffuse = clamp(dot(n, normalize(vec3(0.5, 0.6, 1.0))), 0.0, 1.0) * 0.5 + 0.5;
        c *= diffuse;
        ` : ''}
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    const splatFragSrc = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionFragSrc = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        ${!supportLinearFiltering ? `
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
        ` : `
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        `}
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `;

    const divergenceFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityFragSrc = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradSubtractFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const copyFragSrc = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `;

    // ── Programs ─────────────────────────────────────────────────────────────

    const baseVert = compileShader(gl.VERTEX_SHADER, baseVertSrc);
    const clearProg  = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, clearFragSrc));
    const colorProg  = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, colorFragSrc));
    const displayProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, displayFragSrc));
    const splatProg  = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, splatFragSrc));
    const advectionProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, advectionFragSrc));
    const divergenceProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, divergenceFragSrc));
    const curlProg   = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, curlFragSrc));
    const vorticityProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, vorticityFragSrc));
    const pressureProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, pressureFragSrc));
    const gradSubtractProg = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, gradSubtractFragSrc));
    const copyProg   = createProgram(baseVert, compileShader(gl.FRAGMENT_SHADER, copyFragSrc));

    const clearU = getUniforms(clearProg);
    const colorU = getUniforms(colorProg);
    const displayU = getUniforms(displayProg);
    const splatU = getUniforms(splatProg);
    const advectionU = getUniforms(advectionProg);
    const divergenceU = getUniforms(divergenceProg);
    const curlU = getUniforms(curlProg);
    const vorticityU = getUniforms(vorticityProg);
    const pressureU = getUniforms(pressureProg);
    const gradSubtractU = getUniforms(gradSubtractProg);
    const copyU = getUniforms(copyProg);

    // ── Blit (full-screen quad) ──────────────────────────────────────────────

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (target: WebGLFramebuffer | null) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    // ── FBO helpers ──────────────────────────────────────────────────────────

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): any {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): any {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return fbo1; }, set read(v) { fbo1 = v; },
        get write() { return fbo2; }, set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
      };
    }

    function resizeFBO(target: any, w: number, h: number, internalFormat: number, format: number, type: number, param: number): any {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      gl.useProgram(copyProg);
      gl.uniform1i(copyU.uTexture, target.attach(0));
      blit(newFBO.fbo);
      return newFBO;
    }

    function resizeDoubleFBO(target: any, w: number, h: number, internalFormat: number, format: number, type: number, param: number): any {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w; target.height = h;
      target.texelSizeX = 1 / w; target.texelSizeY = 1 / h;
      return target;
    }

    // ── Simulation FBOs ──────────────────────────────────────────────────────

    let simW = 0, simH = 0, dyeW = 0, dyeH = 0;
    let velocity: any, dye: any, pressure: any, divergence: any, curl: any;

    function getResolution(res: number) {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      const min = Math.round(res);
      const max = Math.round(res * ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    function initFBOs() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      simW = simRes.width; simH = simRes.height;
      dyeW = dyeRes.width; dyeH = dyeRes.height;

      const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      const type = halfFloatTexType;

      if (!velocity) {
        velocity = createDoubleFBO(simW, simH, formatRG.internalFormat, formatRG.format, type, filtering);
        dye = createDoubleFBO(dyeW, dyeH, formatRGBA.internalFormat, formatRGBA.format, type, filtering);
        pressure = createDoubleFBO(simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
        divergence = createFBO(simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
        curl = createFBO(simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
      } else {
        velocity = resizeDoubleFBO(velocity, simW, simH, formatRG.internalFormat, formatRG.format, type, filtering);
        dye = resizeDoubleFBO(dye, dyeW, dyeH, formatRGBA.internalFormat, formatRGBA.format, type, filtering);
        pressure = resizeDoubleFBO(pressure, simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
        divergence = createFBO(simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
        curl = createFBO(simW, simH, formatR.internalFormat, formatR.format, type, gl.NEAREST);
      }
    }

    initFBOs();

    // ── Color generation ─────────────────────────────────────────────────────

    function generateColor() {
      const colors = [
        { r: 0.37, g: 0.52, b: 0.46 },
        { r: 0.90, g: 0.89, b: 0.88 },
        { r: 0.25, g: 0.38, b: 0.32 },
        { r: 0.71, g: 0.82, b: 0.77 },
      ]
      const c = colors[Math.floor(Math.random() * colors.length)]
      return {
        r: c.r * 0.35,
        g: c.g * 0.35,
        b: c.b * 0.35
      }
    }

    // ── Splat ────────────────────────────────────────────────────────────────

    function correctRadius(radius: number) {
      const ar = canvas.width / canvas.height;
      if (ar > 1) radius *= ar;
      return radius;
    }

    function correctDeltaX(delta: number) {
      const ar = canvas.width / canvas.height;
      if (ar < 1) delta *= ar;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const ar = canvas.width / canvas.height;
      if (ar > 1) delta /= ar;
      return delta;
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      gl.useProgram(splatProg);
      gl.uniform1i(splatU.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatU.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatU.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatU.color, dx, -dy, 0.0);
      gl.uniform1f(splatU.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write.fbo);
      velocity.swap();

      gl.uniform1i(splatU.uTarget, dye.read.attach(0));
      gl.uniform3f(splatU.color, color.r, color.g, color.b);
      blit(dye.write.fbo);
      dye.swap();
    }

    function splatPointer(pointer: any) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX * canvas.width, pointer.texcoordY * canvas.height, dx, dy, pointer.color);
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const color = generateColor();
        color.r *= 10; color.g *= 10; color.b *= 10;
        splat(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1000 * (Math.random() - 0.5),
          1000 * (Math.random() - 0.5),
          color
        );
      }
    }

    // ── Simulation step ──────────────────────────────────────────────────────

    function step(dt: number) {
      gl.disable(gl.BLEND);
      gl.viewport(0, 0, simW, simH);

      gl.useProgram(curlProg);
      gl.uniform2f(curlU.texelSize, 1 / simW, 1 / simH);
      gl.uniform1i(curlU.uVelocity, velocity.read.attach(0));
      blit(curl.fbo);

      gl.useProgram(vorticityProg);
      gl.uniform2f(vorticityU.texelSize, 1 / simW, 1 / simH);
      gl.uniform1i(vorticityU.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityU.uCurl, curl.attach(1));
      gl.uniform1f(vorticityU.curl, config.CURL);
      gl.uniform1f(vorticityU.dt, dt);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.useProgram(divergenceProg);
      gl.uniform2f(divergenceU.texelSize, 1 / simW, 1 / simH);
      gl.uniform1i(divergenceU.uVelocity, velocity.read.attach(0));
      blit(divergence.fbo);

      gl.useProgram(clearProg);
      gl.uniform1i(clearU.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearU.value, config.PRESSURE);
      blit(pressure.write.fbo);
      pressure.swap();

      gl.useProgram(pressureProg);
      gl.uniform2f(pressureU.texelSize, 1 / simW, 1 / simH);
      gl.uniform1i(pressureU.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureU.uPressure, pressure.read.attach(1));
        blit(pressure.write.fbo);
        pressure.swap();
      }

      gl.useProgram(gradSubtractProg);
      gl.uniform2f(gradSubtractU.texelSize, 1 / simW, 1 / simH);
      gl.uniform1i(gradSubtractU.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradSubtractU.uVelocity, velocity.read.attach(1));
      blit(velocity.write.fbo);
      velocity.swap();

      gl.useProgram(advectionProg);
      gl.uniform2f(advectionU.texelSize, 1 / simW, 1 / simH);
      if (!supportLinearFiltering) gl.uniform2f(advectionU.dyeTexelSize, 1 / simW, 1 / simH);
      gl.uniform1i(advectionU.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionU.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionU.dt, dt);
      gl.uniform1f(advectionU.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.viewport(0, 0, dyeW, dyeH);
      if (!supportLinearFiltering) gl.uniform2f(advectionU.dyeTexelSize, 1 / dyeW, 1 / dyeH);
      gl.uniform1i(advectionU.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionU.uSource, dye.read.attach(1));
      gl.uniform1f(advectionU.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write.fbo);
      dye.swap();
    }

    function render(target: WebGLFramebuffer | null) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      const w = target == null ? gl.drawingBufferWidth : dyeW;
      const h = target == null ? gl.drawingBufferHeight : dyeH;
      gl.viewport(0, 0, w, h);

      if (!config.TRANSPARENT) {
        gl.useProgram(colorProg);
        const bc = config.BACK_COLOR;
        gl.uniform4f(colorU.color, bc.r, bc.g, bc.b, 1);
        blit(target);
      } else if (target == null) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      gl.useProgram(displayProg);
      gl.uniform2f(displayU.texelSize, 1 / dyeW, 1 / dyeH);
      gl.uniform1i(displayU.uTexture, dye.read.attach(0));
      blit(target);
    }

    // ── Main loop ────────────────────────────────────────────────────────────

    let lastTime = Date.now();
    let colorTimer = 0;
    let animId: number;

    function resizeCanvas(): boolean {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    }

    function update() {
      const now = Date.now();
      let dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      if (resizeCanvas()) initFBOs();

      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer = colorTimer % 1;
        pointers.forEach((p) => { p.color = generateColor(); });
      }

      pointers.forEach((p) => {
        if (p.moved) { p.moved = false; splatPointer(p); }
      });

      if (!config.PAUSED) step(dt);
      render(null);
      animId = requestAnimationFrame(update);
    }

    // ── Event handlers ───────────────────────────────────────────────────────

    function updatePointer(pointer: any, clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = x / canvas.width;
      pointer.texcoordY = 1 - y / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    const onMouseMove = (e: MouseEvent) => {
      updatePointer(pointers[0], e.clientX, e.clientY);
    };

    const onMouseDown = () => {
      pointers[0].down = true;
      pointers[0].color = generateColor();
    };

    const onMouseUp = () => { pointers[0].down = false; };

    const onTouchStart = (e: TouchEvent) => {
      const touches = e.targetTouches;
      while (touches.length >= pointers.length) {
        pointers.push(new (pointerPrototype as any)());
      }
      for (let i = 0; i < touches.length; i++) {
        pointers[i].down = true;
        pointers[i].color = generateColor();
        updatePointer(pointers[i], touches[i].clientX, touches[i].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (pointers[i]) updatePointer(pointers[i], touches[i].clientX, touches[i].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (pointers[i]) pointers[i].down = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ── Init ─────────────────────────────────────────────────────────────────

    resizeCanvas();
    initFBOs();
    multipleSplats(Math.floor(Math.random() * 20) + 5);
    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [
    SIM_RESOLUTION, DYE_RESOLUTION, CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION, VELOCITY_DISSIPATION, PRESSURE,
    PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS, SPLAT_FORCE,
    SHADING, COLOR_UPDATE_SPEED, BACK_COLOR, TRANSPARENT,
  ]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default SplashCursor;
