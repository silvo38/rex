# Example Rex server

This folder serves as an example for how to use the Rex server framework. It
showcases the following features:

- **HTML rendering:** files under `pages/` are HTML page handlers.
- **Static file serving:** all files under `static/` are being served.
- **Justfile and Ningen:** the Ningen build system and the Just command runner
  are all hooked up.
- **Tailwind:** generates CSS
- **Bundling and serving client JS:** bundle TypeScript to JS using esbuild
