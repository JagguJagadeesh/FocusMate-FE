import axios from 'axios'

export async function POST(request: Request) {
  const { userMessage } = await request.json()

  if (!userMessage) {
    return Response.json({ error: 'User message is required' }, { status: 400 })
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You're a helpful study assistant." },
          { role: "user", content: userMessage }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return Response.json({ 
      content: response.data.choices?.[0]?.message?.content ?? 'No response' 
    })
  } catch (error) {
    console.error('AI API error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
