import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import flowbiteReact from "flowbite-react/plugin/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flowbiteReact()],
})
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import flowbitePlugin from 'flowbite/plugin'; // used in tailwind.config.js, not here

// export default defineConfig({
//   plugins: [react()],
// });
