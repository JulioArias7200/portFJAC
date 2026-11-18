---
title: "Optimizando Three.js y GSAP a 60 FPS en el Navegador"
description: "Estrategias prácticas de gestión de memoria WebGL, control de eventos de render y pausas inteligentes al hacer scroll."
pubDate: 2026-03-24
tags: ["Three.js", "GSAP", "WebGL", "Creatividad"]
readTime: "6 min"
---

# Optimizando Three.js y GSAP a 60 FPS

Integrar gráficos 3D en un portafolio web puede elevar notablemente la percepción de calidad técnica, pero requiere un cuidado riguroso de los recursos del hardware.

## 1. Pausar el Render Loop fuera de pantalla
Ejecutar `requestAnimationFrame` cuando el canvas no es visible consume batería y ciclos de GPU de forma innecesaria. Utilizar la API nativa de `IntersectionObserver` para detener la animación cuando el usuario hace scroll hacia otras secciones es vital.

## 2. Limpieza de memoria (Disposal)
Tres elementos clave deben liberarse explícitamente en Three.js:
- `geometry.dispose()`
- `material.dispose()`
- `renderer.dispose()`

## 3. Coordinación con GSAP ScrollTrigger
Cuando vinculamos propiedades de Three.js (como la rotación de cámara o la dispersión de partículas) con el scroll nativo, debemos usar valores normalizados y evitar recrear objetos dentro de los callbacks de scroll.
