import component from './speakEasyFlow2.vue'

export default {
    install: (app, options) => {
        app.component("speak-easy-flow", component);
    }
  }