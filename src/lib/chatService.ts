export async function getAIResponse(userMessage: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return data.content || 'No response'
  } catch (error) {
    console.error('Chat service error:', error)
    return 'Sorry, something went wrong.'
  }
}
