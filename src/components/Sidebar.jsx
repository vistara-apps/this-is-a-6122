import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calculator, 
  Flame,
  Settings,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CAC Tracking', href: '/cac', icon: BarChart3 },
  { name: 'LTV Analysis', href: '/ltv', icon: Users },
  { name: 'MRR Projections', href: '/mrr', icon: TrendingUp },
  { name: 'Burn Rate', href: '/burn-rate', icon: Flame },
  { name: 'Integrations', href: '/integrations', icon: Settings },
]

function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-surface border-r border-gray-200 pt-5 pb-4 overflow-y-auto shadow-card">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-text-primary">ProfitPilot</span>
          </div>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar