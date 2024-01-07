<template>
  <div @mouseover="hover = true" @mouseout="hover = false" :class="{ hovered: hover }">
    <div class="container">
      <div class="column column-1">
        <div style="font-weight: bold" class="row">{{ name }}</div>
        <div style="font-weight: 200" class="row">{{ name2 }}</div>
      </div>
      <div class="column column-2">{{ uuid }}</div>
    </div>
    <hr class="divider-bottom-ds" />
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

const props = defineProps(["name", "name2", "uuid"]);
const { name, name2, uuid } = props;
const hover = ref(false);
const emit = defineEmits(["ho", "submit-event"]);
</script>

<style>
.container {
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
}

.column {
  display: flex;
  flex-direction: column;
}

.column-1 {
  width: 30%;
}

.column-2 {
  width: 70%;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

.row {
  width: 100%;
  /* Optional: Add padding, margin, etc. as per your design */
}

.divider-top {
  border: none;
  height: 1px;
  width: 100%;
  background-color: lightgrey;
  margin-bottom: 10px;
}

.divider-bottom-ds {
  border: none;
  height: 1px;
  width: 100%;
  background-color: lightgrey;
  margin-top: 10px;
  margin-bottom: 0;
}

div.hovered {
  background-color: #dddddd;
}
</style>
