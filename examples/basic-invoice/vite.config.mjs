import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import uhuu from 'vite-plugin-uhuu';
import path from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const event = process.env.npm_lifecycle_event;

  const config = {
    base: '',
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    plugins: [react()],
  };

  if (event === 'uhuu' || event === 'build') config.plugins.push(uhuu());
  if (event === 'uhuu' || event === 'dev:secure' || process.env.LERNA_PACKAGE_NAME) config.plugins.push(mkcert({ savePath: process.env.LERNA_PACKAGE_NAME ? './../../.cert' : '.cert' }));
  if (event === 'build:all') config.build = { outDir: `./../../public/${process.env.npm_package_name}`, emptyOutDir: true };

  return defineConfig(config);
};
