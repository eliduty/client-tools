import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  safelist: [],
  rules: [
    [/^text-(\d+)$/, match => ({ 'font-size': `${match[1]}px` })],
    [/^font-(\d+)$/, match => ({ 'font-weight': `${match[1]}` })],
    [/^rounded-(\d+)$/, match => ({ 'border-radius': `${match[1]}px` })],
  ],
  presets: [presetUno()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
