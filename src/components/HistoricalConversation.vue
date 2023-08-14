<template>
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
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Example conversations object (you can replace this with prop or data from API)
  const conversations = ref([
    { id: 1, sender: 'person1', text: 'Hi, how are you?' },
    { id: 2, sender: 'person2', text: 'I am good, thanks!' },
    { id: 3, sender: 'person1', text: 'Great to hear!' },
    { id: 4, sender: 'person2', text: 'Great to hear!' },
    { id: 5, sender: 'person1', text: 'Great to hear!' },
    { id: 6, sender: 'person2', text: 'Great to hear!' },
    { id: 7, sender: 'person1', text: 'Great to hear!' },
    { id: 8, sender: 'person2', text: 'Great tofdifdoif diofdsi hear!' },
    { id: 9, sender: 'person1', text: 'Great tofdifdoif diofdsi hear!' },
    // More conversations here...
  ]);
  </script>
  
  <style>
  .conversation-container {
    max-width: 400px; /* Adjust as needed */
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
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%; /* Adjust as needed */
  }
  
  .message.left .message-content {
    background-color: #e1ffc7;
  }
  
  .message.right .message-content {
    background-color: #d9eaff;
  }
  </style>
  