<template>
    <div ref="conversationWrapper" :class="{ conversationwrapper: true }">
        
    <div class="conversation-container">
      <div
        v-for="message in conversations"
        :key="message.id"
        class="message"
        :class="message.sender === 'person1' ? 'left' : 'right'"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
    </div>
</div>
</template>
  
<script setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';

const props = defineProps({
  toArchive: {
    type: String,
  }
})

const conversationWrapper = ref(null);
const toArchive2 = computed(() => props.toArchive)

watch(toArchive2, (newValue, oldValue) => {

  if (newValue) {
    addMessage(toArchive2.value)
  }
});

  const conversations = ref([
    { id: 1, sender: 'person1', text: "Hey " },
    { id: 2, sender: 'person2', text: "Hey, how can I help you today?"},
    { id: 3, sender: 'person1', text: "This a potential conversation between a user and an llm of your choice"},
    { id: 3, sender: 'person2', text: "Great to hear!" },
    { id: 3, sender: 'person1', text: "What's the meaning of life?" },
    { id: 3, sender: 'person3', text: "42" },
    { id: 3, sender: 'person2', text: "Should I join e/acc?" },
    { id: 3, sender: 'person1', text: "You can't join it, you're already part of it. So stop thinking and accelerate, anon!" },
    { id: 3, sender: 'person2', text: "First I need a coffee huh." }
  ]);

onMounted(() => {
    conversationWrapper.value.scrollTop = conversationWrapper.value.scrollHeight;
    conversationWrapper.value.addEventListener('click', (event) => {
           event.preventDefault();
        });
});

function addMessage(text) {
    const newId = conversations.value.length > 0 ? conversations.value[conversations.value.length - 1].id + 1 : 1;
    
    let newSender = 'person1';
    if (conversations.value.length > 0 && conversations.value[conversations.value.length - 1].sender === 'person1') {
        newSender = 'person2';
    }
    conversations.value.push({
        id: newId,
        sender: newSender,
        text: text
    });
    conversationWrapper.value.scrollTop = conversationWrapper.value.scrollHeight;
}
  </script>
  
  <style>
  .conversation-container {
    max-width: 90%;
    margin: 0 auto;
  }
  
  .message {
    margin: 10px 0;
    width: 100%;
    display: flex;
  }
  
  .message.left {
    justify-content: flex-start;
  }
  
  .message.right {
    justify-content: flex-end;
  }
  
  .message-content {
    /* background-color: #f0f0f0; */
    padding: 10px;
    border-radius: 10px;
    max-width: 100%; /* Adjust as needed */
  }
  
  .message.left .message-content {
    /* background-color: #e1ffc7; */
  }
  
  .message.right .message-content {
    /* background-color: #d9eaff; */
  }

  .conversationwrapper {
  max-height: 450px; 
  padding-top: 40px;
  overflow-y: auto;
}
  /* overflow-y: auto; */
  </style>
  