<template>
    <div class="main-container">
        <div class="center-wrapper">
        <div class="top-middle-container">
            <transition-group name="list">

                <div v-for="(item, index) in divs" :contenteditable=isReadOnly[index] :key="item"
                    :ref="el => inputRefs[index] = el"
                    :class="['list-item', 'expanding-content', { 'indexzero': index === 0 }, { 'indexone': index === 1 }]"
                    @input="(event) => { updateText(event); resizeInput(index); }" @keyup.enter="submit"
                    @transitionend="handleTransitionEnd">
                    {{ conversation[index] }}
                </div>

            </transition-group>
            <span class="input-measure" ref="measure">{{ conversation[index] }}</span>
        </div>
    </div>
    </div>
</template>
      
<script setup>
import { ref, nextTick, onMounted } from 'vue';

const divs = ref(['a', 'b']);
const isReadOnly = ref(['false', 'true']);
const conversation = ref(['What can I get you aaaaaaaaaaaaaaaaaaaa?', '']);
const inputRefs = ref([]);
const MAX_WIDTH = 300;

const updateText = (event) => {
    conversation.value = [conversation.value[0], event.target.textContent];
};

const submit = () => {
    divs.value = [divs.value[1], divs.value[0]];
    conversation.value = [conversation.value[1], '']
    console.log('conversation', conversation.value)
};

const handleTransitionEnd = () => {
    inputRefs.value[1].focus();
    // inputRefs.value[1].style.height = 'auto'; 
};

const measure = ref(null);

const resizeInput = (index) => {
    nextTick(() => {
        const inputEl = inputRefs.value[index];
        if (inputEl) {
            inputEl.style.height = 'auto';
            inputEl.style.height = `${inputEl.scrollHeight}px`;
        }
    });
};

onMounted(() => {
    inputRefs.value[1].focus();
})


</script>
      
<style>
.list-item {
    transition: transform 1s;
}

.list-item:empty:before {
    content: '\a0';
}


.list-enter-active,
.list-leave-active {
    transition: all 2s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* transform: translateX(30px); */
}

.indexzero {
    text-align: center;
}

.expanding-content {
    z-index: 999999999999;
    border: 0px solid #ccc;
    overflow: visible;
    outline: none;
}


.main-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 10px;
  border-radius: 5px;
  max-width: 60vw;
  min-width: 40vw;
  min-height: 20vh;
  backdrop-filter: blur(10px);
}

.center-wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;
}

.top-middle-container {
  z-index: 1000;
  padding: 10px;
}

</style>
