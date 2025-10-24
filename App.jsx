import React from 'react'
import Header from './components/Header'
import SmartAssessmentApp from './pages/SmartAssessmentApp'

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <SmartAssessmentApp />
      </main>
    </div>
  )
}
