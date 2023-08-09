<template>
    <div 
        @mouseover="enableScroll" 
        @mouseleave="disableScroll" 
        :style="{ bottom: currentBottomInVh + 'vh' }"
        class="scroll-container" 
        ref="content">

        <div class="bottom-sticky" :style="{ height: VISIBLE_HEIGHT_VH + 'vh' }">
            <SpeakEasyFLow></SpeakEasyFLow>
        </div>
    </div>
</template>
  

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SpeakEasyFLow from './speakEasyFlow.vue'

const content = ref(null);
let scrolling = false;

const enableScroll = () => {
    scrolling = true;
};

const disableScroll = () => {
    scrolling = false;
};

const VISIBLE_HEIGHT_VH = ref(15)
const currentBottomInVh = ref(100 - VISIBLE_HEIGHT_VH.value);

const handleScroll = (event) => {
    if (scrolling && content.value) {
        const delta = event.deltaY;
        currentBottomInVh.value -= delta * 0.1;
        currentBottomInVh.value = Math.max(10, Math.min(currentBottomInVh.value, 100 - VISIBLE_HEIGHT_VH.value));
        content.value.style.bottom = `${currentBottomInVh.value}vh`;
    }
};

onMounted(() => {
    window.addEventListener('wheel', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('wheel', handleScroll);
});
</script>
  
<style>
.scroll-container {
    width: 500px;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    background-color: grey;
}

.bottom-sticky {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
  