<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">💬 Real-Time AI Chat Dashboard</h1>
    <div class="border rounded p-4 h-96 overflow-y-scroll mb-2 bg-white shadow">
      <div v-for="msg in messages" :key="msg.id" class="mb-1">
        <strong>{{ msg.user }}:</strong> {{ msg.message }}
      </div>
      <p v-if="typingUser" class="italic text-gray-500">{{ typingUser }} is typing...</p>
    </div>
    <input
      v-model="message"
      @keydown="emitTyping"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
      class="w-full border rounded p-2"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { useFetch } from '#app'

const { data } = await useFetch('/api/messages')
const messages = ref(data.value || [])
const message = ref('')
const typingUser = ref('')
const user = 'You'

const socket = io()

socket.on('new-message', (msg) => {
  messages.value.push(msg)
})

socket.on('user-typing', (who) => {
  if (who !== user) typingUser.value = who
})

socket.on('stop-typing', (who) => {
  if (who === typingUser.value) typingUser.value = ''
})

function sendMessage() {
  if (!message.value) return
  const msg = {
    id: Date.now(),
    user,
    message: message.value,
    timestamp: new Date().toISOString()
  }
  messages.value.push(msg)
  socket.emit('send-message', msg)
  message.value = ''
}

let typingTimeout: any
function emitTyping() {
  socket.emit('typing', user)
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing', user)
  }, 2000)
}
</script>

<style>
body {
  @apply bg-gray-100 text-gray-900;
}
</style>
