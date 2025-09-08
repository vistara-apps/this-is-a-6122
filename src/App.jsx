import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CAC from './components/CAC'
import LTV from './components/LTV'
import MRR from './components/MRR'
import BurnRate from './components/BurnRate'
import Integrations from './components/Integrations'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'cac':
        return <CAC />
      case 'ltv':
        return <LTV />
      case 'mrr':
        return <MRR />
      case 'burn':
        return <BurnRate />
      case 'integrations':
        return <Integrations />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto px-5 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App