require('dotenv').config()
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const { analyzeWithOpenAI } = require('./ai/openai')

const app = express()
app.use(cors())
app.use(express.json())

const UPLOAD_DIR = path.join(__dirname, 'uploads')
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null, UPLOAD_DIR),
  filename: (req,file,cb)=>cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
})
const upload = multer({storage})

let SUBMISSIONS = []

app.post('/api/submissions/upload', upload.array('files', 10), (req,res)=>{
  const items = req.files.map(f=>{
    const id = Date.now()+Math.floor(Math.random()*1000)
    const item = { id, name: f.originalname, path: f.filename, uploadedAt: new Date().toLocaleString(), analysis: null }
    SUBMISSIONS.push(item)
    return item
  })
  res.json(items)
})

app.get('/api/submissions', (req,res)=>{
  res.json(SUBMISSIONS)
})

app.post('/api/submissions/:id/analyze', async (req,res)=>{
  const id = parseInt(req.params.id)
  const sub = SUBMISSIONS.find(s=>s.id===id)
  if(!sub) return res.status(404).json({error:'Không tìm thấy'})

  try{
    if(process.env.OPENAI_API_KEY){
      const filepath = path.join(UPLOAD_DIR, sub.path)
      const analysis = await analyzeWithOpenAI(filepath, sub)
      sub.analysis = analysis
    } else {
      const scores = { 'sử dụng công cụ': Math.floor(50+Math.random()*50), 'an toàn số': Math.floor(40+Math.random()*60), 'sáng tạo': Math.floor(30+Math.random()*70), 'trình bày': Math.floor(40+Math.random()*60), 'hợp tác': Math.floor(30+Math.random()*70) }
      const overall = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
      const level = overall>=80?'Sáng tạo': overall>=65?'Thành thạo': overall>=50?'Trung bình':'Cơ bản'
      sub.analysis = { scores, overall, level, feedback: ['Mẫu phản hồi tự động (thay bằng LLM).'], history: [] }
    }
    res.json(sub)
  }catch(err){
    console.error(err)
    res.status(500).json({error:'Lỗi khi phân tích'})
  }
})

app.use('/uploads', express.static(UPLOAD_DIR))

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log('Backend running on', PORT))
