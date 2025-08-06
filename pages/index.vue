<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Real-Time Chat Dashboard
      </h1>
      
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <!-- Chat Header -->
        <div class="bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 class="text-xl font-semibold">Team Chat</h2>
          <p class="text-blue-100 text-sm">{{ messages.length }} messages</p>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="h-96 overflow-y-auto p-4 space-y-2">
          <!-- Regular Messages -->
          <div
            v-for="message in messages"
            :key="message.id"
            class="chat-message"
            :class="`message-${message.user.toLowerCase()}`"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="font-semibold text-sm">{{ message.user }}</span>
              <span class="text-xs text-gray-500">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
            <p class="text-gray-800">{{ message.message }}</p>
          </div>

          <!-- Typing Indicator -->
          <div v-if="typingUser" class="typing-indicator">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span>{{ typingUser }} is typing...</span>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="border-t p-4">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        <!-- Connection Status -->
        <div class="px-4 pb-2">
          <div class="flex items-center text-sm">
            <div
              :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
              class="w-2 h-2 rounded-full mr-2"
            ></div>
            <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { io } from 'socket.io-client'

// Reactive state
const messages = ref([])
const typingUser = ref('')
const newMessage = ref('')
const isConnected = ref(false)
const messagesContainer = ref(null)
let socket = null

// Load initial messages
const loadMessages = async () => {
  try {
    const response = await $fetch('/api/messages')
    messages.value = response.messages
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

// Format timestamp
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Send message
const sendMessage = () => {
  if (!newMessage.value.trim() || !socket) return

  socket.emit('sendMessage', {
    user: 'You',
    message: newMessage.value.trim()
  })

  newMessage.value = ''
}

// Watch messages for auto-scroll
watch(messages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

watch(typingUser, () => {
  nextTick(() => scrollToBottom())
})

onMounted(async () => {
  // Load initial messages
  await loadMessages()

  // Initialize WebSocket connection with retry logic
  const initializeSocket = () => {
    socket = io({
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    socket.on('connect', () => {
      console.log('Connected to server')
      isConnected.value = true
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      isConnected.value = false
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      isConnected.value = false
    })

    socket.on('newMessage', (message) => {
      console.log('Received message:', message)
      messages.value.push(message)
      // Keep only last 20 messages for performance
      if (messages.value.length > 20) {
        messages.value.shift()
      }
    })

    socket.on('typing', (data) => {
      console.log('Typing event:', data)
      if (data.isTyping) {
        typingUser.value = data.user
      } else {
        typingUser.value = ''
      }
    })
  }

  // Initialize socket connection
  initializeSocket()
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
})
</script>