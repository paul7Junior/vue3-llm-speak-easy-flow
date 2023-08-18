<template>
    <div ref="conversationWrapper" @wheel="handleWheel" :class="{ conversationwrapper: true }">
        
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
<!-- {{ touchDown }}
<button @click="gg">fffff</button> -->
</template>
  
<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, watchEffect, computed } from 'vue';

// const { touchDown, toArchive } = defineProps(['touchDown', 'toArchive']);

const props = defineProps({
    touchDown: {
    type: Boolean,
  },
  toArchive: {
    type: String,
  }
})

// const { toArchive } = defineProps(['toArchive']);
const conversationWrapper = ref(null);
const emit = defineEmits(['message-sent']);

// const toArchive2 = ref(toArchive)
// useContext().expose({ count })

const toArchive2 = computed(() => {
    return props.toArchive;
})


watch(toArchive2, (newValue, oldValue) => {
  if (newValue) {
    addMessage(toArchive2.value)
    console.log('hhhh', toArchive2.value);
  }
});

// watch(() => toArchive2, (newText, oldText) => {
//     console.log('jiijij')
// //   if (newText !== oldText && newText) {
// //     const newId = conversations.value.length > 0 ? conversations.value[conversations.value.length - 1].id + 1 : 1;
// //     const newMessage = {
// //       id: newId,
// //       sender: 'newSender', // Adjust as needed
// //       text: newText
// //     };
// //     conversations.value.push(newMessage);
// //   }
// });

const sendMessage = () => {
  emit('message-sent', 'Hello, Parent!');
};
  const conversations = ref([
    { id: 1, sender: 'person1', text: 'Hi, how are you?' },
    { id: 2, sender: 'person2', text: 'I am good, thanks!' },
    { id: 3, sender: 'person1', text: 'Great t8899o hear!' },
    { id: 3, sender: 'person2', text: 'GreHSYUSYHUSAUSYAHUSYAHSYAUat to hear!' },
    { id: 3, sender: 'person1', text: 'GreatJHSHSHSHHSS to hear!' },
    { id: 3, sender: 'person3', text: 'AAAGreat to hear!' },
    { id: 3, sender: 'person2', text: 'VVVVVGreat to hear!' },
    { id: 3, sender: 'person1', text: 'Grfdsjfidsfsidjfdeat to hear!' },
    { id: 3, sender: 'person3', text: 'GrdfjjfjjjJJJJJeat to hear!' },
    { id: 3, sender: 'person1', text: 'GreaHHHHHHHt to hear!' }
  ]);

onMounted(() => {
    conversationWrapper.value.scrollTop = conversationWrapper.value.scrollHeight;
});


function handleWheel(event) {

    const isAtBottom = conversationWrapper.value.scrollTop + conversationWrapper.value.clientHeight >= conversationWrapper.value.scrollHeight;
    if (isAtBottom) {
        sendMessage()
    }

    if (props.touchDown) {
        conversationWrapper.value.addEventListener('click', (event) => {
           event.preventDefault();
        });
    }
}

function addMessage(text) {
    const newId = conversations.value.length > 0 ? conversations.value[conversations.value.length - 1].id + 1 : 1;
    
    let newSender = 'person1';
    if (conversations.value.length > 0 && conversations.value[conversations.value.length - 1].sender === 'person1') {
        newSender = 'person2';
    }
    console.log('ADDED message')
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
  