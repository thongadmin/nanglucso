import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { CloudUpload, FileText, DownloadCloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SmartAssessmentApp(){
  const [submissions, setSubmissions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleFiles(e){
    const files = Array.from(e.target.files)
    const next = files.map(file=>({ id: Date.now()+Math.random(), name: file.name, type: file.type, file, uploadedAt: new Date().toISOString(), analysis: null }))
    setSubmissions(s=>[...next, ...s])
    e.target.value = null
  }

  async function analyzeSubmission(sub){
    setLoading(true)
    await new Promise(r=>setTimeout(r,700))
    const name = sub.name.toLowerCase()
    const scores = {
      'Sử dụng công cụ': 60 + Math.floor(Math.random()*35),
      'An toàn số': 50 + Math.floor(Math.random()*45),
      'Sáng tạo': 45 + Math.floor(Math.random()*45),
      'Trình bày': 50 + Math.floor(Math.random()*45),
      'Hợp tác': 45 + Math.floor(Math.random()*45),
    }
    if(name.includes('ppt')||name.includes('slide')) scores['Trình bày'] += 8
    if(name.includes('code')||name.includes('.py')||name.includes('.cpp')||name.includes('scratch')) scores['Sử dụng công cụ'] += 8
    const overall = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
    const level = overall>=80?'Sáng tạo': overall>=65?'Thành thạo': overall>=50?'Trung bình':'Cơ bản'
    const analysis = { scores, overall, level, feedback: generateFeedback(scores), history: generateHistory(overall) }
    setSubmissions(arr=>arr.map(x=>x.id===sub.id?{...x, analysis}:x))
    setLoading(false)
  }

  function generateFeedback(scores){
    const out = []
    if(scores['Sử dụng công cụ'] < 60) out.push('Cần cải thiện kỹ năng sử dụng công cụ (ví dụ: Scratch, Google Slides).')
    else out.push('Sử dụng công cụ tốt — thử các nhiệm vụ nâng cao.')
    if(scores['An toàn số'] < 60) out.push('Rèn luyện an toàn số: mật khẩu, trích nguồn, quyền riêng tư.')
    else out.push('An toàn số ổn. Giữ thói quen trích nguồn.')
    if(scores['Sáng tạo'] < 55) out.push('Tăng cường hoạt động thiết kế (poster, storyboard).')
    else out.push('Rất sáng tạo — thử những project phức tạp hơn.')
    if(scores['Trình bày'] < 60) out.push('Cải thiện cấu trúc slide và lời dẫn.')
    if(scores['Hợp tác'] < 55) out.push('Tăng cường làm việc nhóm và chia sẻ tài nguyên.')
    return out
  }

  function generateHistory(current){
    const base = Math.max(30, current-18)
    return Array.from({length:6}).map((_,i)=>({ date: new Date(Date.now() - (5-i)*24*60*60*1000).toLocaleDateString(), score: Math.min(98, Math.max(20, base + i*3 + Math.floor(Math.random()*7))) }))
  }

  function analyzeAll(){
    const toAnalyze = submissions.filter(s=>!s.analysis)
    toAnalyze.forEach((s,i)=>setTimeout(()=>analyzeSubmission(s), i*450))
  }

  function downloadReport(sub){
    const blob = new Blob([JSON.stringify(sub, null, 2)], {type:'application/json'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${sub.name.replace(/\s+/g,'_')}_report.json`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Smart Assessment</h1>
            <p className="text-sm text-slate-500">Đánh giá năng lực số bằng AI — giao diện prototype đẹp, responsive</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border hover:bg-slate-50">Hướng dẫn</button>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow">Đăng nhập</button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-lg"><CloudUpload /></div>
                  <div>
                    <div className="font-semibold">Nộp sản phẩm</div>
                    <div className="text-xs text-slate-400">Tải lên file (pptx, pdf, image, code, scratch)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                    "..., truncated for brevity ..."
