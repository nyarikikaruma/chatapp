import { Server } from 'socket.io'
import type { NitroApp } from 'nitropack'

let io: Server

export default async (_nitroApp: NitroApp) => {
  // Initialize on ready hook
  _nitroApp.hooks.hook('ready', async (nitro) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Initializing Socket.IO server in development mode...')
      
      // Get the HTTP server from Nitro
      const server = nitro.httpServer
      if (server) {
        io = new Server(server, {
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          },
          transports: ['websocket', 'polling']
        })

        const users = ['Alice', 'Bob', 'Charlie']
        let messageId = 6

        io.on('connection', (socket) => {
          console.log('Client connected:', socket.id)

          socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
          })

          socket.on('sendMessage', (data) => {
            const message = {
              id: messageId++,
              user: data.user || 'User',
              message: data.message,
              timestamp: new Date().toISOString()
            }
            console.log('Broadcasting message:', message)
            io.emit('newMessage', message)
          })
        })

        // Simulate activity
        const simulateActivity = () => {
          if (io && io.sockets.sockets.size > 0) {
            const randomUser = users[Math.floor(Math.random() * users.length)]
            io.emit('typing', { user: randomUser, isTyping: true })

            setTimeout(() => {
              if (io) {
                io.emit('typing', { user: randomUser, isTyping: false })
                
                if (Math.random() > 0.6) {
                  const messages = [
                    'How is everyone doing?',
                    'Great work on the project!',
                    'Anyone free for a quick call?',
                    'Thanks for the update!',
                    'Looking forward to the meeting.',
                    'Perfect timing!',
                    'Sounds good to me.',
                    'Let me know if you need help.'
                  ]
                  
                  const newMessage = {
                    id: messageId++,
                    user: randomUser,
                    message: messages[Math.floor(Math.random() * messages.length)],
                    timestamp: new Date().toISOString()
                  }
                  
                  console.log('Auto message:', newMessage)
                  io.emit('newMessage', newMessage)
                }
              }
            }, 2000 + Math.random() * 3000)
          }
        }

        // Start simulation after a delay
        setTimeout(() => {
          console.log('Starting chat simulation...')
          setInterval(simulateActivity, 8000 + Math.random() * 7000)
        }, 3000)
      } else {
        console.error('HTTP server not available')
      }
    }
  })

  _nitroApp.hooks.hook('close', async () => {
    if (io) {
      console.log('Closing Socket.IO server...')
      io.close()
    }
  })
}