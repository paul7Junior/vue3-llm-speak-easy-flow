<template>
  <div
    class="scroll-container"
    @click="scrollContainerClick"
    @mouseover="enableScroll"
    @mouseleave="disableScroll"
    :class="{ 'no-transition': isWheelEventTriggered }"
    :style="{ bottom: currentBottomInVh + 'vh', width: MAX_WIDTH_VW + 'vw' }"
    ref="content"
  >
    <div
      id="historicalConversation"
      class="top-div"
      :style="{ bottom: VISIBLE_HEIGHT_VH + 'vh' }"
    >
      <historicalConversations
        ref="historicalConv"
        :touchDown="touchDown"
        :toArchive="toArchive"
        @message-sent="scrollTouch"
      ></historicalConversations>
    </div>

    <div class="bottom-sticky" :style="{ height: VISIBLE_HEIGHT_VH + 'vh' }">
      <div class="main-container" ref="groupConv">
        <div class="center-wrapper">
          <div style="width: 100%; text-align: center">
            <TransitionGroup name="fade">
              <div
                v-for="(item, index) in divs"
                class="item"
                :class="[{ human: item === 'human' }, { ai: item === 'ai' }]"
                :contenteditable="index === focusedIndex ? true : false"
                :key="item"
                :ref="(el) => (inputRefs[index] = el)"
                @input="
                  (event) => {
                    updateText(event);
                    resizeInput(index);
                  }
                "
                @keydown.enter.prevent="submit"
              >
                {{ textDisplayed[index] }}
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    style="
      position: fixed;
      backdrop-filter: blur(10px);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999999;
    "
    :style="{ top: 100 - currentBottomInVh + 'vh', width: MAX_WIDTH_VW + 'vw' }"
  >
    <itemList
      @click="emit('clickSuggestion', item.uuid);"
        v-for="item in props.autoSuggestionData"
        :key="item.name"
        :name="item.name"
        :name2="item.name"
        :uuid="item.uuid"
    ></itemList>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed, watch, nextTick } from "vue";
import historicalConversations from "./components/HistoricalConversation.vue";
import { defineEmits } from "vue";
import itemList from "./components/ItemList.vue";

const props = defineProps({
  apiResponse: {
    type: String,
    default: "",
  },
  apiStatus: {
    type: String,
    default: "",
  },
  autoSuggestionData: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["input", "submit-event", "clickSuggestion"]);

const focusedIndex = ref(0);
const player = ref("human");
const divs = ref(["1"]);
const contenteditable = ref(["true"]);
const conversation = ref([""]);
const inputRefs = ref([]);
const MAX_WIDTH_VW = ref(50);
const hasBeenManuallyScrolled = ref(false);
const apiStatus = computed(() => props.apiStatus);
const apiResponse = computed(() => props.apiResponse);
const autoSuggestionData = computed(() => props.autoSuggestionData);

const VISIBLE_HEIGHT_VH = ref(5);
const currentBottomInVh = ref(100 - VISIBLE_HEIGHT_VH.value);
const content = ref(null);
const groupConv = ref(null);
let scrolling = false;
const initialLineHeight = ref(null);
const touchDown = ref(false);
const toArchive = ref("");
const isWheelEventTriggered = ref(false);
const historicalConv = ref();

const textDisplayed = computed({
  get: () => conversation.value,
  set: (newValue) => {
    if (player.value === "human") {
      conversation.value.push(newValue);
      return conversation.value;
    } else if (player.value === "ai") {
      conversation.value[0] = newValue;
    }
  },
});

watch(apiResponse, (newValue, oldValue) => {
  textDisplayed.value = props.apiResponse;
  updateVisibleHeightAndBottom();
});

watch(autoSuggestionData, (newValue, oldValue) => {
  console.log('sssss');
  console.log(newValue);
  console.log(props.autoSuggestionData)
});

watch(apiStatus, (newValue, oldValue) => {
  if (apiStatus.value === "closed") {
    divs.value.push("human");
    focusedIndex.value = 1;
    player.value = "human";
    textDisplayed.value = "";
    nextTick(() => {
      updateVisibleHeightAndBottom();
      inputRefs.value[focusedIndex.value].focus();
    });
    updateVisibleHeightAndBottom();
  }
});

const updateText = (event) => {
  emit("input", event.target.textContent);
  if (player.value === "human" && divs.value.length == 2) {
    toArchive.value = textDisplayed.value[0];
    divs.value.splice(0, 1);
    player.value = "ai";
    focusedIndex.value = 0;
    textDisplayed.value = "";
    let el = document.getElementsByClassName("human");
    el[0].focus();
    nextTick(() => {
      updateVisibleHeightAndBottom();
      // conversation.value[0] = event.target.textContent
      player.value = "human";
    });
  }
  // conversation.value = [conversation.value[0], event.target.textContent];
};

const submit = (event) => {
  if (player.value === "human") {
    toArchive.value = event.target.textContent;
    emit("submit-event", event.target.textContent);
    divs.value.splice(0, 1);
    divs.value.push("");
    player.value = "ai";
  } else if (player.value === "ai") {
    divs.value.splice(0, 1);
  }
  updateVisibleHeightAndBottom();
};

const updateVisibleHeightAndBottom = () => {
  if (!hasBeenManuallyScrolled.value) {
    let currentHeightContainer = convertPxToVh(groupConv.value.offsetHeight);
    currentBottomInVh.value = 100 - currentHeightContainer;
    VISIBLE_HEIGHT_VH.value = 100 - currentBottomInVh.value;
    content.value.style.bottom = currentBottomInVh.value + "vh";
  }
};

const handleTransitionEnd = () => {
  inputRefs.value[focusedIndex.value].focus();
};

const scrollContainerClick = (event) => {
  event.stopPropagation();
  inputRefs.value[focusedIndex.value].focus();
};

const resizeInput = (index) => {
  updateVisibleHeightAndBottom();
};

onMounted(() => {
  inputRefs.value[focusedIndex.value].focus();
  window.addEventListener("wheel", handleScroll);
  updateVisibleHeightAndBottom();
  initialLineHeight.value = inputRefs.value[0].style.height;

  document.getElementsByTagName("body")[0].addEventListener("click", (event) => {
    currentBottomInVh.value = 100 - VISIBLE_HEIGHT_VH.value;
    touchDown.value = false;
  });

  document.getElementsByTagName("body")[0].addEventListener("wheel", (event) => {
    if (currentBottomInVh.value <= 100 - VISIBLE_HEIGHT_VH.value - 10) {
      enableScroll();
      handleScroll(event);
    }
  });
});

const handleScroll = (event) => {
  isWheelEventTriggered.value = true;
  if (scrolling && content.value) {
    if (!touchDown.value) {
      hasBeenManuallyScrolled.value = true;
      const delta = event.deltaY;
      currentBottomInVh.value += delta * 0.1;
      currentBottomInVh.value = Math.max(
        10,
        Math.min(currentBottomInVh.value, 100 - VISIBLE_HEIGHT_VH.value)
      );
      content.value.style.bottom = `${currentBottomInVh.value}vh`;
      if (currentBottomInVh.value >= 100 - VISIBLE_HEIGHT_VH.value) {
        hasBeenManuallyScrolled.value = false;
      } else {
      }
    }

    if (currentBottomInVh.value === 10) {
      touchDown.value = true;
    }
  }
};

onUnmounted(() => {
  window.removeEventListener("wheel", handleScroll);
  window.removeEventListener("click", handleScroll);
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
  touchDown.value = false;
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

.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
}

.bottom-sticky {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.sticky-div {
  position: sticky;
  top: 100%;
  background-color: "red"; /* Optional: set a background color */
  /* Additional CSS properties as per your requirement */
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

.expanding-content {
  z-index: 999999999999;
  border: 0px solid #ccc;
  overflow: visible;
  outline: none;
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

.list-item {
  transition: transform 1s;
  height: 24px;
}

.list-item:empty:before {
  content: "\a0";
}

.item {
  outline: none;
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

.list-leave-active {
  position: absolute;
}
</style>
