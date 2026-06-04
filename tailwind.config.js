import { defineConfig } from "vite";
import react from "@vitejs/react-refresh"; // 혹은 @vitejs/plugin-react
import tailwindcss from "@tailwindcss/vite"; // 💡 최신 v4 전용 플러그인 임포트

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 💡 여기에 플러그인을 쏙 넣어줍니다!
  ],
});
