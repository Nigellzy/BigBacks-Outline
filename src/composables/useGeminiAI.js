import { GoogleGenAI } from '@google/genai'
import { ref } from 'vue'

const isLoading = ref(false)
const error = ref(null)

// Initialize Gemini AI - The client gets the API key from the environment variable
const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

export function useGeminiAI() {
  const generateResponse = async (userMessage, context = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // Construct the prompt with context and constraints
      const systemPrompt = `You are FoodBot, an AI assistant for the FoodSaver app that helps users reduce food waste and manage their food inventory efficiently.

Context about the user:
- Current food inventory: ${context.inventoryCount || 0} items
- Items expiring soon: ${context.expiringSoon || 0}
- Current food score: ${context.userScore || 0} points
- Total money saved: $${context.totalSaved || 0}

Guidelines for responses:
1. Keep responses concise and helpful (2-3 sentences max)
2. Focus on food waste reduction, meal planning, and inventory management
3. Be encouraging and positive about their food-saving efforts
4. Provide actionable advice when possible
5. If asked about non-food topics, politely redirect to food-related matters

User message: ${userMessage}`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
      })

      return response.text
    } catch (err) {
      error.value = 'Failed to get AI response. Please try again.'
      console.error('Gemini AI Error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const generateFoodSuggestions = async (expiringItems) => {
    isLoading.value = true
    error.value = null

    try {
      const prompt = `Given these food items that are expiring soon: ${expiringItems.join(', ')}, suggest 2-3 simple recipes or ways to use them. Keep each suggestion brief (one sentence) and focus on reducing waste.`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })

      return response.text
    } catch (err) {
      error.value = 'Failed to generate suggestions. Please try again.'
      console.error('Gemini AI Error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    generateResponse,
    generateFoodSuggestions,
    isLoading,
    error
  }
}