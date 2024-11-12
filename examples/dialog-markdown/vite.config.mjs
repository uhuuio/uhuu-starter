import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from'vite-plugin-mkcert'
import uhuu from 'vite-plugin-uhuu'
import fs from 'fs';
import path from 'path';

export default ({mode, command}) => {
    // Load app-level env vars to node-level env vars.
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    let config = {
      base: '',
      resolve:{
        alias:{
          '@' : path.resolve(__dirname, './src') // alias to src directory
        }
      },
      plugins: [react()]
    };

    // uhuu plugin
    if(process.env?.npm_lifecycle_event == "uhuu")
      config.plugins.push(uhuu());
    
    // custom certificate
    if(process.env?.npm_lifecycle_event == "dev:secure" || process.env.LERNA_PACKAGE_NAME)
      config.plugins.push(mkcert({savePath: './../../.cert'}));    
    
    // move to public folder if it's built with lerna
    if(command == "build" && process.env.LERNA_PACKAGE_NAME)
      config.build = { outDir : "./../../public/" + process.env.npm_package_name, emptyOutDir: true }

    return defineConfig(config);
}
