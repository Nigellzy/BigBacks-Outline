<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'
import { useGeminiAI } from '../composables/useGeminiAI'
import { useUser } from '../composables/useUser'
import { useFoodItems } from '../composables/useFoodItems'

const { generateResponse, isLoading, error } = useGeminiAI()
const { user } = useUser()
const { activeFoodItems, expiringSoon } = useFoodItems()

const messages = ref([
  {
    id: '1',
    text: 'Hello! I\'m your FoodSaver AI assistant. How can I help you reduce food waste today?',
    sender: 'ai',
    timestamp: new Date()
  }
])

const messageInput = ref('')
const chatContainer = ref(null)

const quickQuestions = [
  'How do I store bananas?',
  'Recipe ideas with expiring items?',
  'Best way to freeze bread?',
  'How to reduce food waste?',
  'Tips for meal planning'
]

const userContext = computed(() => ({
  inventoryCount: activeFoodItems.value.length,
  expiringSoon: expiringSoon.value,
  userScore: user.value.currentScore,
  totalSaved: user.value.totalSaved
}))

const sendMessage = async () => {
  if (!messageInput.value.trim() || isLoading.value) return

  const userMessage = {
    id: Date.now().toString(),
    text: messageInput.value,
    sender: 'user',
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const currentInput = messageInput.value
  messageInput.value = ''
  scrollToBottom()

  try {
    // Add loading message
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Thinking...',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true
    }
    messages.value.push(loadingMessage)
    scrollToBottom()

    // Get AI response with user context
    const aiResponse = await generateResponse(currentInput, userContext.value)
    
    // Remove loading message and add actual response
    messages.value.pop()
    const aiMessage = {
      id: (Date.now() + 2).toString(),
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
    scrollToBottom()

  } catch (err) {
    // Remove loading message and show error
    messages.value.pop()
    const errorMessage = {
      id: (Date.now() + 3).toString(),
      text: 'Sorry, I encountered an error. Please try again.',
      sender: 'ai',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
    scrollToBottom()
  }
}

const handleQuickQuestion = (question) => {
  messageInput.value = question
  sendMessage()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="container-fluid p-4 d-flex flex-column" style="height: calc(100vh - 80px);">
    <div class="mb-4">
      <div class="d-flex align-items-center gap-2 mb-2">
        <i class="bi bi-robot fs-3"></i>
        <h1 class="h2 mb-0">FoodSaver AI Assistant</h1>
      </div>
      <p class="text-muted">Ask me anything about food storage, recipes, or waste reduction</p>
    </div>

    <div class="mb-3">
      <div class="d-flex gap-2 flex-wrap">
        <button
          v-for="question in quickQuestions"
          :key="question"
          class="btn btn-sm btn-outline-secondary"
          @click="handleQuickQuestion(question)"
        >
          {{ question }}
        </button>
      </div>
    </div>

    <div
      ref="chatContainer"
      class="glass-card flex-1 p-4 mb-3 overflow-auto"
      style="max-height: calc(100vh - 350px);"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="d-flex"
        :class="message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'"
      >
        <div
          class="chat-message"
          :class="message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'"
        >
          <div v-if="message.sender === 'ai'" class="d-flex align-items-start gap-2">
            <i class="bi bi-robot"></i>
            <div>
              <div v-if="message.isLoading" class="d-flex align-items-center gap-2">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                {{ message.text }}
              </div>
              <div v-else>{{ message.text }}</div>
            </div>
          </div>
          <div v-else>{{ message.text }}</div>
        </div>
      </div>
    </div>

    <div class="glass-card p-3">
      <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3">
        {{ error }}
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>
      <form @submit.prevent="sendMessage" class="d-flex gap-2">
        <input
          v-model="messageInput"
          type="text"
          class="form-control"
          placeholder="Type your message..."
          :disabled="isLoading"
        />
        <button type="submit" class="btn btn-primary-gradient" :disabled="isLoading || !messageInput.trim()">
          <div v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <i v-else class="bi bi-send me-2"></i>
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border-radius: 0.75rem;
}

.chat-message {
  max-width: 70%;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
}

.chat-message-user {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 0.25rem;
}

.chat-message-ai {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

.btn-primary-gradient {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border: none;
  color: white;
}

.btn-primary-gradient:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  transform: translateY(-1px);
}

.btn-primary-gradient:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-message {
    max-width: 85%;
  }
}
</style>
