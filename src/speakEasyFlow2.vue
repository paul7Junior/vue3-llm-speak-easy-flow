<template>
    <div>
        <div @mouseover="enableScroll" 
        @mouseleave="disableScroll" 
        :style="{ bottom: currentBottomInPixels+'px' }"
        class="scroll-container" 
        ref="content">
        
        <div class="bottom-sticky">
            <SpeakEasyFLow class="fixed-child"></SpeakEasyFLow>
        </div>
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
    setTimeout(() => {
  scrolling = false;
}, 1000);    
};


const currentBottomInPixels = ref(500);

const handleScroll = (event) => {
  if (scrolling && content.value) {
    const delta = event.deltaY;
    currentBottomInPixels.value -= delta;
    currentBottomInPixels.value = Math.max(100, Math.min(currentBottomInPixels.value, 700));
    content.value.style.bottom = `${currentBottomInPixels.value}px`;
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
    background-color: aqua;
}

.bottom-sticky {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
}

</style>
  