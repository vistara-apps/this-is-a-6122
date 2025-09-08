import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CAC from './pages/CAC'
import LTV from './pages/LTV'
import MRR from './pages/MRR'
import BurnRate from './pages/BurnRate'
import Integrations from './pages/Integrations'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cac" element={<CAC />} />
        <Route path="/ltv" element={<LTV />} />
        <Route path="/mrr" element={<MRR />} />
        <Route path="/burn-rate" element={<BurnRate />} />
        <Route path="/integrations" element={<Integrations />} />
      </Routes>
    </Layout>
  )
}

export default App