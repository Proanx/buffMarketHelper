/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '*.svelte'
declare module '*.svx'

declare const $: any;
declare const g: any;   // buff页面window.g 用于存储货币与汇率信息
declare let GM_info;
declare let GM_getValue: Function;
declare let GM_setValue: Function;
declare let GM_addStyle: Function;
declare let GM_xmlhttpRequest: Function;
declare let GM_getResourceText: Function;
declare let GM_registerMenuCommand: Function;
