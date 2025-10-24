import React from 'react'
import { motion } from 'framer-motion'

export default function Header(){
  return (
    <motion.header initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="bg-white/70 backdrop-blur-sm shadow-md rounded-2xl mx-4 my-6 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-extrabold">SA</div>
        <div>
          <div className="text-xl font-bold">Smart Assessment</div>
          <div className="text-sm text-slate-500">Đánh giá năng lực số bằng AI</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg border">Hướng dẫn</button>
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Đăng nhập</button>
      </div>
    </motion.header>
  )
}
