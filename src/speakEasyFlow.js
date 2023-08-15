import SpeakEasy from './speakEasyFlow.vue'

export default {
    install(app, options) {
        app.component("SpeakEasy", SpeakEasy);
    }
}