---
title: "Arquitectura de Islas: El Secreto del Rendimiento Extremo en Astro"
description: "Cómo la hidratación selectiva y el envío de cero JavaScript por defecto transforman los Core Web Vitals en sitios orientados a contenido."
pubDate: 2026-03-10
tags: ["Astro", "Rendimiento", "Frontend"]
readTime: "4 min"
---

# Arquitectura de Islas en Astro

Cuando construimos aplicaciones web tradicionales con Single Page Applications (SPAs), el navegador suele recibir un paquete masivo de JavaScript que debe analizar y ejecutar antes de que el usuario pueda interactuar con la interfaz.

Astro revoluciona este enfoque con la **Arquitectura de Islas** (*Islands Architecture*):

## ¿Cómo funciona?

1. **HTML Estático por Defecto:** Todo el contenido estático (textos, cabeceras, pie de página) se procesa en el build o en el servidor y se envía como HTML puro y ligero.
2. **Hidratación Selectiva:** Solo aquellos componentes interactivos (un carrusel, un modelo 3D o un formulario dinámico) se convierten en islas aisladas mediante directivas como `client:visible` o `client:idle`.
3. **Cero Bloqueo de CPU:** El hilo principal del navegador permanece libre para renderizar animaciones y responder de inmediato a los eventos del usuario.

## Conclusión

Al separar la presentación estática de la interactividad puntual, logramos puntuaciones de 100/100 en Google Lighthouse de forma natural.
