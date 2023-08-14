<template>

<div 
        class="scroll-container" 
        @mouseover="enableScroll" 
        @mouseleave="disableScroll" 
        :style="{ bottom: currentBottomInVh + 'vh', width: MAX_WIDTH_VW+'vw' }"
        ref="content">

        <div class="bottom-sticky" :style="{ height: VISIBLE_HEIGHT_VH + 'vh' }">

        <div ref="groupConv" class="main-container">
            <div class="center-wrapper">
                <div ref="groupConvOld">
                    <transition-group name="list">
                        <div v-for="(item, index) in divs" :contenteditable=isReadOnly[index] 
                            :key="item"
                            :ref="el => inputRefs[index] = el"
                            :class="['list-item', 'expanding-content', { 'indexzero': index === 0 }, { 'indexone': index === 1 }]"
                            @input="(event) => { updateText(event); resizeInput(index); }" @keyup.enter="submit"
                            @transitionend="handleTransitionEnd">
                            {{ conversation[index] }}
                        </div>
                        <span class="input-measure" ref="measure">{{ conversation[index] }}</span>
                    </transition-group>
                    
                </div>
            </div>
        </div>


    </div>
    </div>
    <button @click="gg">fffff</button>
</template>
      
<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';

const divs = ref(['a', 'b']);
const isReadOnly = ref(['false', 'true']);
const conversation = ref(['', '']);
const inputRefs = ref([]);
const MAX_WIDTH_VW = ref(50);
const hasBeenManuallyScrolled = ref(false);


const VISIBLE_HEIGHT_VH = ref(15)
const currentBottomInVh = ref(100 - VISIBLE_HEIGHT_VH.value);
const content = ref(null);
const groupConv = ref(null);
let scrolling = false;
const measure = ref(null);
const initialLineHeight = ref(null)

const updateText = (event) => {
    conversation.value = [conversation.value[0], event.target.textContent];
};


const submit = () => {
    // inputRefs.value[0].style.borderBottom = '0'
    // inputRefs.value[1].style.borderBottom = '0'
    divs.value = [divs.value[1], divs.value[0]];
    conversation.value = [conversation.value[1], '']
    inputRefs.value[0].style.height = initialLineHeight.value    
    updateVisibleHeightAndBottom()
};

const updateVisibleHeightAndBottom = () => {
    if (!hasBeenManuallyScrolled.value) {
        let currentHeightContainer = convertPxToVh(groupConv.value.offsetHeight)
        currentBottomInVh.value = 100 - currentHeightContainer - 3
        VISIBLE_HEIGHT_VH.value = 100 - currentBottomInVh.value
        content.value.style.bottom = currentBottomInVh.value + 'vh'   
    }
}

const handleTransitionEnd = () => {
    inputRefs.value[1].focus();
};

const resizeInput = (index) => {
        const inputEl = inputRefs.value[index];
        if (inputEl) {
            inputEl.style.height = 'auto';
            inputEl.style.height = `${inputEl.scrollHeight}px`;
            updateVisibleHeightAndBottom()
        }
};

function convertPxToVh(pxValue) {
  const viewportHeight = window.innerHeight;
  return (pxValue / viewportHeight) * 100;
}

onMounted(() => {
    inputRefs.value[1].focus();
    window.addEventListener('wheel', handleScroll);
    updateVisibleHeightAndBottom()
    console.log('inputRefs.value[0].style.height', inputRefs.value[0].style.height)
    initialLineHeight.value = inputRefs.value[0].style.height
})

onUnmounted(() => {
    window.removeEventListener('wheel', handleScroll);
});


const enableScroll = () => {
    scrolling = true;
};

const disableScroll = () => {
    scrolling = false;
};

const handleScroll = (event) => {
    if (scrolling && content.value) {
        hasBeenManuallyScrolled.value = true
        const delta = event.deltaY;
        currentBottomInVh.value += delta * 0.1;
        currentBottomInVh.value = Math.max(10, Math.min(currentBottomInVh.value, 100 - VISIBLE_HEIGHT_VH.value));
        content.value.style.bottom = `${currentBottomInVh.value}vh`;
    }
};

</script>
      
<style>

.expanding-content {
    z-index: 999999999999;
    border: 0px solid #ccc;
    overflow: visible;
    outline: none;
}


.main-container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    min-width: 30vw;
    /* min-height: 20vh; */
    backdrop-filter: blur(10px);
    
}

.center-wrapper {
    display: flex;
    justify-content: center;
    max-width: 100%;
}

.scroll-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    backdrop-filter: blur(10px);
    border-bottom: 2px solid #d4af37;
}

.bottom-sticky {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.indexzero {
    text-align: center;
    margin-bottom: 10px;
}

.indexone {
    /* border-bottom: 2px solid #d4af37; */
    /* min-width: 25vw; */
}



.list-item {
    transition: transform 1s;
    height: 24px;
}

.list-item:empty:before {
    content: '\a0';
}

.list-item br {
    line-height: 0;
    height: 0;
    content: "";
    display: none;
    /* You could also try setting display to none */
}

.list-enter-active,
.list-leave-active {
    transition: all 2s ease;
}


</style>
