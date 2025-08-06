import { Server } from 'socket.io'
import type { NitroApp } from 'nitropack'

let io: Server | null = null

export default async (_nitroApp: NitroApp) => {
  // This will be initialized when the server starts
}

export function initSocket(server: any) {
  if (io) return io
  
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // Simulate real-time chat behavior
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    
    // Simulate typing indicators and new messages
    const simulateActivity = () => {
      const users = ['Alice', 'Bob', 'Charlie', 'Diana']
      const randomUser = users[Math.floor(Math.random() * users.length)]
      
      // Random typing event
      if (Math.random() > 0.5) {
        socket.emit('typing', { user: randomUser, isTyping: true })
        
        setTimeout(() => {
          socket.emit('typing', { user: randomUser, isTyping: false })
          
          // Send a message after typing
          const messages = [
            "That sounds great!",
            "I agree with that.",
            "Let me check on that.",
            "Good point!",
            "Thanks for sharing.",
            "I'll get back to you soon."
          ]
          const randomMessage = messages[Math.floor(Math.random() * messages.length)]
          
          socket.emit('newMessage', {
            id: Date.now(),
            user: randomUser,
            message: randomMessage,
            timestamp: new Date().toISOString()
          })
        }, 2000 + Math.random() * 3000) // 2-5 seconds
      }
    }
    
    // Start simulation
    const interval = setInterval(simulateActivity, 5000 + Math.random() * 10000) // Every 5-15 seconds
    
    socket.on('sendMessage', (data) => {
      // Broadcast the message to all connected clients
      io?.emit('newMessage', {
        id: Date.now(),
        user: data.user || 'Anonymous',
        message: data.message,
        timestamp: new Date().toISOString()
      })
    })
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      clearInterval(interval)
    })
  })

  return io
}

export { io }