<template>
<div>
  <!-- <div style="position: absolute;top:0;left:0">

    <div>dddd foidsfoids ufodsifu odi fsddddd foifdijosf diofj dosf diofj sojf diof dof si
      dsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi
      fsd</div>
    <div>dddd foidsfoids ufodsifu odi fsddddd foifdijosf diofj dosf diofj sojf diof dof si
      dsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi
      fsd</div>
    <div>dddd foidsfoids ufodsifu odi fsddddd foifdijosf diofj dosf diofj sojf diof dof si
      dsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi
      fsd</div>
    <div>dddd foidsfoids ufodsifu odi fsddddd foifdijosf diofj dosf diofj sojf diof dof si
      dsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi
      fsd</div>
    <div>dddd foidsfoids ufodsifu odi fsddddd foifdijosf diofj dosf diofj sojf diof dof si
      dsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi fsddddd foidsfoids ufodsifu odi
      fsd</div>
  </div> -->
  <speak-easy @submit-event="startStream" :apiResponse="llmResponseString" :apiStatus="apiStatus"></speak-easy>
</div>
</template>

<script setup>
import { ref } from 'vue'

const llmResponseString = ref('')
const apiStatus = ref('')

function startStream() {
  console.log('AAAA')
        
        setTimeout(() => {
          let websocket;
          websocket = new WebSocket("wss://localhost:8000/ws");
        
          websocket.onopen = (event) => {
            console.log('Opened connection')
            llmResponseString.value = ''
            apiStatus.value = ''
              websocket.send(JSON.stringify({'text': 'Hey'}));
          };
      
          websocket.onmessage = (event) => {
            // console.log('event', event)
              // dataList.value.push({ id: Date.now(), content: event.data });
              // this.llmResponse.push({ id: Date.now(), content: event.data })
              // this.llmResponse.push(event.data)
              llmResponseString.value = llmResponseString.value + event.data
              // console.log('this.llmResponse', this.llmResponse)
              // console.log('this.llmResponseString', llmResponseString.value)
          };
      
          websocket.onerror = (error) => {
              console.error("WebSocket Error:", error);
          };
      
          websocket.onclose = (event) => {
              if (event.wasClean) {
                  apiStatus.value = 'closed'
                  console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
              } else {
                  console.error('Connection died');
              }
          };
      }, 500)
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
}</style>
