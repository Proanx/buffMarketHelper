import { defineConfig } from 'vite';
import type { RollupOptions, WatcherOptions } from 'rollup';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import sveltePreprocess from 'svelte-preprocess';
import svelteSVG from 'vite-plugin-svelte-svg';
import flexbugs from 'postcss-flexbugs-fixes';
import alias from '@rollup/plugin-alias'; // @ts-ignore
import autoprefixer from 'autoprefixer';
import { mdsvex } from "mdsvex";
import * as path from 'path';
import * as fs from 'fs';

const FILE_NAME = "main.user.js";
const headerText = fs.readFileSync("./src/header.user.js").toString()
const srcPath = path.resolve(__dirname, 'src');

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      alias({
        entries: [
          { find: 'src', replacement: srcPath },
        ]
      }),
      svelteSVG({
        svgoConfig: {}, // See https://github.com/svg/svgo#configuration
        requireSuffix: false, // Set false to accept '.svg' without the '?component'
      }),
      svelte({
        extensions: ['.svelte', '.svx'],
        preprocess: [mdsvex(), sveltePreprocess()]
      }),
      cssInjectedByJsPlugin(),
      header(headerText, mode === "dev"),
    ],
    json: {
      stringify: true
    },
    css: {
      postcss: {
        plugins: [
          // 前缀追加
          autoprefixer({
            overrideBrowserslist: ["defaults"],
            grid: true,
          }),
          flexbugs,
        ],
      }
    },
    build: {
      outDir: "dist",
      cssCodeSplit: false,
      minify: false,
      rollupOptions: {
        input: "src/main.ts",
        output: <RollupOptions>{
          format: 'iife',
          file: `dist/${FILE_NAME}`,
          dir: undefined,
        },
        plugins: [
        ]
      },
      watch: mode === "dev" ? <WatcherOptions>{
        buildDelay: 500,
        clearScreen: true
      } : null
    },
  })
}

function header(text, dev = true) {
  return {
    name: "vite-plugin-header",
    generateBundle(OutputOptions, ChunkInfo) {
      let filename = String(OutputOptions.file).replace("dist/", "");
      let newCode = text + "\n" + ChunkInfo[filename].code;
      ChunkInfo[filename].code = newCode;
      if (dev) {
        let index = String(text).lastIndexOf("\n");
        let newText = text.slice(0, index) + `// @require file:///${path.join(__dirname, "/dist/" + FILE_NAME)}` + text.slice(index);
        if (!fs.existsSync("dist")) {
          fs.mkdirSync("dist");
        }
        fs.writeFileSync(path.join(__dirname, "/dist/" + FILE_NAME.replace(".js", ".dev.js")), newText);
      }
    }
  }
}