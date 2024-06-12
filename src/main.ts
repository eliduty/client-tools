import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.css";
import "virtual:uno.css";
// 引入组件库的少量全局样式变量
import "tdesign-vue-next/es/style/index.css";
const app = createApp(App);
app.mount("#app").$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
