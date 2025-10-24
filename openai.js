const fs = require('fs')
const path = require('path')
const { OpenAI } = require('openai')

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function analyzeWithOpenAI(filepath, submission){
  const summary = `File: ${submission.name}. Size: ${fs.statSync(filepath).size} bytes.`
  const rubric = `Cho điểm 0-100 theo: Sử dụng công cụ, An toàn số, Sáng tạo, Trình bày, Hợp tác. Trả về JSON.`

  const prompt = `Bạn là chuyên gia giáo dục. Dựa trên tóm tắt: ${summary} và rubric: ${rubric}, hãy cho điểm từng tiêu chí và viết phản hồi ngắn. Trả về đúng JSON: {scores:{"sử dụng công cụ":int, "an toàn số":int, "sáng tạo":int, "trình bày":int, "hợp tác":int}, overall:int, level:string, feedback:[...]}`

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 400
  })

  const text = resp.choices?.[0]?.message?.content || resp.choices?.[0]?.text || ''
  try{
    const jsonStart = text.indexOf('{')
    const jsonText = text.slice(jsonStart)
    const parsed = JSON.parse(jsonText)
    return parsed
  }catch(err){
    return { scores: { 'sử dụng công cụ': 60, 'an toàn số': 60, 'sáng tạo': 60, 'trình bày': 60, 'hợp tác': 60 }, overall: 60, level: 'Trung bình', feedback: ['Không parse được kết quả từ LLM.'] }
  }
}

module.exports = { analyzeWithOpenAI }
