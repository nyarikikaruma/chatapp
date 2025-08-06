<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Real-Time Chat Dashboard
      </h1>
      
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Messages Container -->
        <div class="h-96 overflow-y-auto p-4 bg-gray-50" ref="messagesContainer">
          <!-- Initial Messages -->
          <div v-for="message in allMessages" :key="message.id" class="message-bubble">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-semibold text-blue-600">{{ message.user }}</span>
                <p class="text-gray-800 mt-1">{{ message.message }}</p>
              </div>
              <span class="text-xs text-gray-400 ml-4">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>
          
          <!-- Typing Indicators -->
          <div v-if="typingUsers.length > 0" class="typing-indicator">
            {{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'is' : 'are' }} typing...
          </div>
        </div>
        
        <!-- Input Section -->
        <div class="p-4 border-t border-gray-200 bg-white">
          <div class="flex gap-2">
            <input
              v-model="newMessage"
              @keyup.enter="handleSendMessage"
              type="text"
              placeholder="Type your message..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="handleSendMessage"
              :disabled="!newMessage.trim()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      
      <!-- Connection Status -->
      <div class="text-center mt-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <span class="w-2 h-2 rounded-full mr-2"
                :class="isConnected ? 'bg-green-400' : 'bg-red-400'"></span>
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { messages: socketMessages, typingUsers, sendMessage } = useSocket()

// State
const newMessage = ref('')
const initialMessages = ref([])
const messagesContainer = ref(null)
const isConnected = ref(true)

// Computed
const allMessages = computed(() => {
  return [...initialMessages.value, ...socketMessages.value]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})

// Methods
const handleSendMessage = () => {
  if (!newMessage.value.trim()) return
  
  sendMessage(newMessage.value, 'You')
  newMessage.value = ''
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Load initial messages
onMounted(async () => {
  try {
    const response = await $fetch('/api/messages')
    if (response.success) {
      initialMessages.value = response.data
    }
  } catch (error) {
    console.error('Failed to load initial messages:', error)
    isConnected.value = false
  }
})

// Auto-scroll to bottom when new messages arrive
watch(allMessages, () => {
  scrollToBottom()
}, { deep: true })

// Set page title
useHead({
  title: 'Real-Time Chat Dashboard',
  meta: [
    { name: 'description', content: 'A real-time chat dashboard built with Nuxt 3' }
  ]
})
</script>