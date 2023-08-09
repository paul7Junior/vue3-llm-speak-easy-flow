import component from './speakEasyFlow.vue'

export default {
    install: (app, options) => {
        app.component("speak-easy-flow", component);
    }
  }