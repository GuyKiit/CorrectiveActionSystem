import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
const outputDirMap = {
  dev: 'build/DEV/dist',
  uat: 'build/UAT/dist',
  prod: 'build/PROD/dist',
};

// https://vitejs.dev/config/
// Export Vite configuration
export default defineConfig(({ mode }) => {
  // Determine the correct output directory based on the mode
  const outDir = outputDirMap[mode as keyof typeof outputDirMap] || 'build/DEV/dist';

  return {
    plugins: [react(), tailwindcss()],
    base: "/cas/",
    build: {
      chunkSizeWarningLimit: 3000,      
      outDir, // Set the output directory dynamically
      rollupOptions: {
        input: '/index.html',
      },
    },
    // esbuild: {
    //   drop: ["console", "debugger"],
    // },
  };
});