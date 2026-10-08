# Umami Projects — Video "Escala"

Video vertical (1080×1920, 35 s, 30 fps) hecho con [Remotion](https://www.remotion.dev/).

## Uso

```bash
npm install
npm run studio   # previsualizar y editar en el navegador
npm run render   # genera out/umami-escala.mp4
```

## Estructura

- `src/UmamiEscala.tsx`: guion, escenas y duraciones (en frames, 30 = 1 s).
- `src/componentes.tsx`: paleta de marca, texto animado, bloques de color y clips.
- `public/clips/`: clips de stock recortados a 1080×1920.
- `public/brand/`: logo.

Para cambiar un texto, un color o un clip, editá la escena correspondiente en `src/UmamiEscala.tsx` y volvé a renderizar.
