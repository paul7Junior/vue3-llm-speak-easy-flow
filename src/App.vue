<template>
  <div>
    <p style="font-size: 100px;padding-top: 150px;">CHECK THAT OUT: TheDeepEngine.co</p>
    <speak-easy
      @clickSuggestion="clickSuggestion"
      @submit-event="startStream"
      :apiResponse="llmResponseString"
      :apiStatus="apiStatus"
      :autoSuggestionData="autoSuggestionData"
    ></speak-easy>
  </div>
</template>

<script setup>
import { ref } from "vue";

const llmResponseString = ref("");
const apiStatus = ref("");

const autoSuggestionData = ref([
  { name: "AAAddAAA", name2: "instanceOf", uuid: "description1" },
  { name: "AAAffsAAA", name2: "instanceOf", uuid: "description2" },
  { name: "AAAfdsfdAAA", name2: "instanceOf", uuid: "description3" },
]);

function clickSuggestion(event) {
  autoSuggestionData.value = []
}

function startStream(submittedValue) {
  setTimeout(() => {
    let websocket;
    websocket = new WebSocket("wss://localhost:8000/ws");

    websocket.onopen = (event) => {
      llmResponseString.value = "";
      apiStatus.value = "";
      websocket.send(JSON.stringify({ text: submittedValue }));
    };

    websocket.onmessage = (event) => {
      llmResponseString.value = llmResponseString.value + event.data;
    };

    websocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    websocket.onclose = (event) => {
      if (event.wasClean) {
        apiStatus.value = "closed";
        console.log(
          `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error("Connection died");
      }
    };
  }, 1000);
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

body {
  background-color: antiquewhite;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
