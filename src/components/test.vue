<template>
    <div>
      <transition name="fade" mode="out-in">
        <div
          v-if="showTopDiv"
          class="editable-div"
          contenteditable="true"
        >
          Top Editable Div
        </div>
      </transition>
  
      <transition name="slide-up" mode="out-in">
        <div
          v-if="showBottomDiv"
          class="editable-div"
          contenteditable="true"
          @keyup.enter="handleEnter"
        >
          Bottom Editable Div
        </div>
      </transition>
    </div>
  </template>


<script setup>
import { ref } from 'vue'

const showTopDiv = ref(true)
const showBottomDiv = ref(true)

const handleEnter = () => {
  showTopDiv.value = false
  setTimeout(() => {
    showBottomDiv.value = true
    showTopDiv.value = true
  }, 500)
}
</script>

<style scoped>
.editable-div {
  /* Style as needed */
}

/* Fade transition for the top div */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Slide up transition for the bottom div */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s;
}
.slide-up-enter, .slide-up-leave-to /* .slide-up-leave-active in <2.1.8 */ {
  transform: translateY(100%);
}
</style>
