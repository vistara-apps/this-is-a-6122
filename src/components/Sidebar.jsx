import React from 'react'
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Flame, 
  Settings,
  PieChart,
  Home
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'cac', label: 'CAC Tracking', icon: DollarSign },
  { id: 'ltv', label: 'LTV Prediction', icon: Users },
  { id: 'mrr', label: 'MRR Projection', icon: TrendingUp },
  { id: 'burn', label: 'Burn Rate', icon: Flame },
  { id: 'integrations', label: 'Integrations', icon: Settings },
]

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-surface shadow-card border-r border-gray-100">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <PieChart className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-text-primary">ProfitPilot</h1>
        </div>
        <p className="text-sm text-text-secondary mt-1">Financial Dashboard</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar