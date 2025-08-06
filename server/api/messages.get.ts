interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

const messages: Message[] = [
  {"id": 1, "user": "Alice", "message": "Hey team, morning!", "timestamp": "2025-07-29T08:01:00Z"},
  {"id": 2, "user": "Bob", "message": "Morning Alice!", "timestamp": "2025-07-29T08:01:15Z"},
  {"id": 3, "user": "Charlie", "message": "Anyone up for lunch later?", "timestamp": "2025-07-29T08:02:00Z"},
  {"id": 4, "user": "Alice", "message": "Count me in.", "timestamp": "2025-07-29T08:02:10Z"},
  {"id": 5, "user": "Bob", "message": "Same here!", "timestamp": "2025-07-29T08:02:20Z"}
];

export default defineEventHandler(async (event) => {
  return {
    messages: messages.slice(-5) // Return last 5 messages
  };
});