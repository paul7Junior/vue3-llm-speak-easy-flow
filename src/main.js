import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import speakEasyFlow from './speakEasyFlow'

const app = createApp(App)
app.use(speakEasyFlow)
app.mount("#app");