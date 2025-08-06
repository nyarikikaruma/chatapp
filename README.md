# 💬 Real-Time Chat Dashboard

A real-time chat app built with **Nuxt 3**, featuring live messages and typing indicators using **WebSocket (Socket.IO)**.

## ⚙️ Features

* Real-time messaging
* Typing indicators
* Tailwind CSS styling
* Fullstack (Nuxt 3 + API routes + WebSocket)

## 🛠️ Tech Stack

* **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
* **Backend**: Nuxt Server API, Socket.IO

## 🚀 Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd realtime-chat-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🧪 Test Real-Time Behavior

* Open in two tabs to see live messages and typing.
* Built-in simulation sends fake typing/messages every few seconds.

## 🔌 API Endpoints

* `GET /api/messages` – returns 5 latest messages.
* WebSocket `/ws/chat` – handles typing and message events.

## 📁 Structure (Simplified)

```
/server/api/messages.get.ts
/server/plugins/socket.ts
/composables/useSocket.ts
/app.vue
```

## 📦 Build & Deploy

```bash
npm run build   # Build for production
npm run preview # Preview build
```