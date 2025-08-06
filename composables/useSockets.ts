import { io, type Socket } from 'socket.io-client'
import type { Ref } from 'vue'

interface Message {
  id: number
  user: string
  message: string
  timestamp: string
}

interface TypingIndicator {
  user: string
  isTyping: boolean
}

export const useSocket = () => {
  const config = useRuntimeConfig()
  const socket: Socket = io(config.public.socketUrl)
  
  const messages: Ref<Message[]> = ref([])
  const typingUsers: Ref<string[]> = ref([])
  
  // Listen for new messages
  socket.on('newMessage', (message: Message) => {
    messages.value.push(message)
    // Keep only last 50 messages for performance
    if (messages.value.length > 50) {
      messages.value = messages.value.slice(-50)
    }
  })
  
  // Listen for typing indicators
  socket.on('typing', (data: TypingIndicator) => {
    if (data.isTyping) {
      if (!typingUsers.value.includes(data.user)) {
        typingUsers.value.push(data.user)
      }
    } else {
      typingUsers.value = typingUsers.value.filter(user => user !== data.user)
    }
  })
  
  // Send a message
  const sendMessage = (message: string, user: string = 'You') => {
    socket.emit('sendMessage', { message, user })
  }
  
  // Disconnect when component is unmounted
  onBeforeUnmount(() => {
    socket.disconnect()
  })
  
  return {
    messages: readonly(messages),
    typingUsers: readonly(typingUsers),
    sendMessage
  }
}