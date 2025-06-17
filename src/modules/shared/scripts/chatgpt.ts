import OpenAI from 'openai'

export const queryChatgpt = async (prompt: string) => {
  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    const completion: any = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      n: 1,
    })

    const message = completion.choices[0].message.content

    return message
  } catch (error) {
    return error
  }
}
