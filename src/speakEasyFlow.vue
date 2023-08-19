<template>
    <div class="scroll-container" @click="scrollContainerClick" @mouseover="enableScroll" @mouseleave="disableScroll"
        :class="{ 'no-transition': isWheelEventTriggered }"
        :style="{ bottom: currentBottomInVh + 'vh', width: MAX_WIDTH_VW + 'vw' }" ref="content">

        <div id="historicalConversation" class="top-div" :style="{ bottom: VISIBLE_HEIGHT_VH + 'vh' }">
            <historicalConversations ref="historicalConv" :touchDown="touchDown" :toArchive="toArchive" @message-sent="scrollTouch"></historicalConversations>
        </div>

        <div class="bottom-sticky" :style="{ height: VISIBLE_HEIGHT_VH + 'vh' }">
            <div ref="groupConv" class="main-container">
                <div class="center-wrapper">
                    <div>
                        <!-- <transition-group name="list">
                            <div v-for="(item, index) in divs" :contenteditable=isReadOnly[index] :key="item"
                                :ref="el => inputRefs[index] = el"
                                :class="['list-item', 'expanding-content', { 'indexzero': index === 0 }, { 'indexone': index === 1 }]"
                                @input="(event) => { updateText(event); resizeInput(index); }" @keyup.enter="submit"
                                @transitionend="handleTransitionEnd">
                                {{ conversation[index] }}
                            </div>
                        </transition-group> -->


                        <TransitionGroup tag="ul" name="fade" class="container">
                        <div v-for="(item, index) in divs" 
                        class="item" 
                        :contenteditable=contenteditable[index]
                        :key="item"
                        :ref="el => inputRefs[index] = el"
                        @keydown.enter.prevent="submit"
                        >
                        {{ item }}
                        </div>
                    </TransitionGroup>
                    </div>
                    
                </div>
            </div>
        </div>

        {{ apiResponse }}kKK
    </div>
</template>
      
<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import historicalConversations from './components/HistoricalConversation.vue'
import { defineEmits } from 'vue';


const getInitialItems = () => [1, 2, 3, 4, 5]
const items = ref(getInitialItems())

const props = defineProps({
    apiResponse: {
    type: String,
    default: ''
  }})

const emit = defineEmits();

const focusedIndex = ref(0)
const player = ref('human')
const divs = ref(['1']);
const contenteditable = ref(['true']);
const conversation = ref(['', '']);
const inputRefs = ref([]);
const MAX_WIDTH_VW = ref(50);
const hasBeenManuallyScrolled = ref(false);


const VISIBLE_HEIGHT_VH = ref(5)
const currentBottomInVh = ref(100 - VISIBLE_HEIGHT_VH.value);
const content = ref(null);
const groupConv = ref(null);
let scrolling = false;
const initialLineHeight = ref(null)
const touchDown = ref(false)
const toArchive = ref('')
const isWheelEventTriggered = ref(false);

const historicalConv = ref()

const updateText = (event) => {
    conversation.value = [conversation.value[0], event.target.textContent];
};

const submit = () => {
    if (player.value === 'human') {
        divs.value.splice(0, 1)
        divs.value.push('')
        emit('submit-event', 'Hey');
    }
    // divs.value = [divs.value[1], divs.value[0], divs.value[2]];
    // toArchive.value = conversation.value[1]
    // conversation.value = [conversation.value[1], '']
    // inputRefs.value[0].style.height = initialLineHeight.value
    // updateVisibleHeightAndBottom()
};

const updateVisibleHeightAndBottom = () => {
    if (!hasBeenManuallyScrolled.value) {
        console.log('inputRefsinputRefs', inputRefs.value[0].style.offsetHeight)
        console.log('inputRefsinputRefs', inputRefs.value[0].offsetHeight)
        let currentHeightContainer = convertPxToVh(groupConv.value.offsetHeight)
        currentBottomInVh.value = 100 - currentHeightContainer
        VISIBLE_HEIGHT_VH.value = 100 - currentBottomInVh.value
        content.value.style.bottom = currentBottomInVh.value + 'vh'
    }
}

const handleTransitionEnd = () => {
    inputRefs.value[focusedIndex.value].focus();
};

const scrollContainerClick = (event) => {
    event.stopPropagation();
    inputRefs.value[focusedIndex.value].focus();
}

const resizeInput = (index) => {
    const inputEl = inputRefs.value[index];
    if (inputEl) {
        inputEl.style.height = 'auto';
        inputEl.style.height = `${inputEl.scrollHeight}px`;
        updateVisibleHeightAndBottom()
    }
};

onMounted(() => {
    inputRefs.value[focusedIndex.value].focus();
    window.addEventListener('wheel', handleScroll);
    updateVisibleHeightAndBottom()
    initialLineHeight.value = inputRefs.value[0].style.height

    document.getElementsByTagName('body')[0].addEventListener('click',
        (event) => {
            currentBottomInVh.value = 100 - VISIBLE_HEIGHT_VH.value
            touchDown.value = false
        })

    document.getElementsByTagName('body')[0].addEventListener('wheel',
        (event) => {
            if (currentBottomInVh.value <= 100 - VISIBLE_HEIGHT_VH.value -10) {
                enableScroll()
                handleScroll(event)
            }
        })
})

const handleScroll = (event) => {
    isWheelEventTriggered.value = true;
    if (scrolling && content.value) {
        if (!touchDown.value) {
            hasBeenManuallyScrolled.value = true
            const delta = event.deltaY;
            currentBottomInVh.value += delta * 0.1;
            currentBottomInVh.value = Math.max(10, Math.min(currentBottomInVh.value, 100 - VISIBLE_HEIGHT_VH.value));
            content.value.style.bottom = `${currentBottomInVh.value}vh`;
            if (currentBottomInVh.value >= 100 - VISIBLE_HEIGHT_VH.value) {
                hasBeenManuallyScrolled.value = false
            } else {

            }
        }

        if (currentBottomInVh.value === 10) {
            touchDown.value = true
        }
    }
};

onUnmounted(() => {
    window.removeEventListener('wheel', handleScroll);
    window.removeEventListener('click', handleScroll);
});

function convertPxToVh(pxValue) {
    const viewportHeight = window.innerHeight;
    return (pxValue / viewportHeight) * 100;
}

const enableScroll = () => {
    scrolling = true;
};

const disableScroll = () => {
    scrolling = false;
};

const scrollTouch = (msg) => {
    touchDown.value = false
};

watchEffect(() => {
    if (isWheelEventTriggered.value) {
        setTimeout(() => {
            isWheelEventTriggered.value = false;
        }, 400);
    }
});

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
    transition: bottom 0.3s ease;
    z-index: 9999999999;
}

.bottom-sticky {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.top-div {
    position: absolute;
    bottom: 100px;
    left: 0;
    right: 0;
    /* height: 50px;  */
    /* background-color: blue; */
}

.indexzero {
    text-align: center;
    /* margin-bottom: 10px; */
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

.list-leave-to {
    opacity: 0;
}

.scroll-container.no-transition {
    transition: none !important;
}


.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
</style>
