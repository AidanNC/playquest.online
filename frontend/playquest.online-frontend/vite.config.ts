import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
    // port: 5173,
		proxy: {
			"/api": {
				// target: "http://10.0.0.66:4000",
				target: "http://174.138.51.78:4000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
