# Plan y verificación

Riesgo medio: nuevo bloque de portafolio, cuatro imágenes y ampliación de la galería. Reversión: retirar el bloque y las imágenes mediante `git revert` del futuro commit. Señal de fallo tras publicación: galería rota, imágenes no cargadas, texto que sugiera uso real en el local o desplazamiento horizontal en móvil.

Constitution Check: conserva la arquitectura y tokens existentes; añade contenido y componente local sin dependencia ni origen externo. Las capturas solo contienen datos ficticios. No cambia rutas, SEO de rutas, formularios ni privacidad. El responsable debe revisar diff y autorizar commit, push y despliegue de este cambio concreto según la constitución.

Tareas: documentar hechos y estado; generar capturas en demo; integrar un selector de casos y una galería dependiente del caso activo; verificar build, navegación de las flechas, cambio y reinicio de galería, y vista móvil/escritorio; presentar diff. No integrar ni desplegar sin autorización expresa.
