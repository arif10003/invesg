import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';


const root=fileURLToPath(new URL('.',import.meta.url));
const backend=resolve(root,'invesg-backend-unified');
export default defineConfig(({command})=>({
 root,
 // Preserve the already-working frontend environment; no .env files are moved.
 envDir:resolve(backend,'frontend-landing'),
 base:command==='serve'?'/':'/site/',
 plugins:[react(),tailwindcss()],
 resolve:{dedupe:['react','react-dom']},
 server:{host:'127.0.0.1',port:5173,strictPort:true,origin:'http://localhost:5173',
  cors:{origin:['http://localhost:8000','http://127.0.0.1:8000']},
  hmr:{host:'localhost',port:5173},
  watch:{ignored:['**/invesg-backend-unified/storage/**','**/invesg-backend-unified/vendor/**','**/invesg-backend-unified/public/**','**/invesg-backend-unified/frontend-landing/**','**/invesg-unified-backup*/**','**/Backend/**']},
  proxy:{'/api':{target:'http://localhost:8000',changeOrigin:false},'/storage':{target:'http://localhost:8000',changeOrigin:false},'/admin':{target:'http://localhost:8000',changeOrigin:false},'/build':{target:'http://localhost:8000',changeOrigin:false}},
 },
 build:{outDir:resolve(backend,'public/site'),emptyOutDir:true},
}));
