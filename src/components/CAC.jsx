import React, { useState } from 'react'
import Card from './ui/Card'
import StatDisplay from './ui/StatDisplay'
import Chart from './ui/Chart'
import { DollarSign, Plus, ExternalLink } from 'lucide-react'

const CAC = () => {
  const [isAddingChannel, setIsAddingChannel] = useState(false)
  const [newChannel, setNewChannel] = useState({ name: '', spend: '', conversions: '' })

  const channels = [
    { name: 'Google Ads', spend: 5200, conversions: 64, cac: 81.25, color: '#4285f4' },
    { name: 'Meta Ads', spend: 3800, conversions: 42, cac: 90.48, color: '#1877f2' },
    { name: 'LinkedIn Ads', spend: 2100, conversions: 18, cac: 116.67, color: '#0077b5' },
    { name: 'Content Marketing', spend: 1500, conversions: 25, cac: 60.00, color: '#059669' },
  ]

  const weeklyData = [
    { week: 'Week 1', googleAds: 85, metaAds: 92, linkedin: 110 },
    { week: 'Week 2', googleAds: 78, metaAds: 88, linkedin: 125 },
    { week: 'Week 3', googleAds: 82, metaAds: 95, linkedin: 115 },
    { week: 'Week 4', googleAds: 81, metaAds: 90, linkedin: 117 },
  ]

  const totalSpend = channels.reduce((sum, channel) => sum + channel.spend, 0)
  const totalConversions = channels.reduce((sum, channel) => sum + channel.conversions, 0)
  const averageCAC = totalSpend / totalConversions

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.spend && newChannel.conversions) {
      const cac = parseFloat(newChannel.spend) / parseFloat(newChannel.conversions)
      console.log('Adding channel:', { ...newChannel, cac })
      setNewChannel({ name: '', spend: '', conversions: '' })
      setIsAddingChannel(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Customer Acquisition Cost</h1>
          <p className="text-text-secondary mt-1">Track and optimize your marketing spend efficiency</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setIsAddingChannel(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Channel</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Sync Platforms
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatDisplay
          title="Average CAC"
          value={`$${averageCAC.toFixed(2)}`}
          change="-5.2%"
          trend="down"
          icon={DollarSign}
          color="success"
        />
        <StatDisplay
          title="Total Ad Spend"
          value={`$${totalSpend.toLocaleString()}`}
          change="+12.3%"
          trend="up"
          icon={DollarSign}
          color="primary"
        />
        <StatDisplay
          title="Total Conversions"
          value={totalConversions.toString()}
          change="+18.7%"
          trend="up"
          icon={DollarSign}
          color="success"
        />
      </div>

      {/* CAC by Channel */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">CAC by Marketing Channel</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Channel</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Spend</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Conversions</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">CAC</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel, index) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="font-medium text-text-primary">{channel.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 text-text-primary">${channel.spend.toLocaleString()}</td>
                  <td className="text-right py-4 text-text-primary">{channel.conversions}</td>
                  <td className="text-right py-4">
                    <span className="font-medium text-text-primary">${channel.cac.toFixed(2)}</span>
                  </td>
                  <td className="text-right py-4">
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CAC Trends */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">CAC Trends (Last 4 Weeks)</h3>
        <Chart 
          data={weeklyData} 
          type="line" 
          dataKey="googleAds"
          color="#4285f4"
          height={350}
        />
      </Card>

      {/* Add Channel Modal */}
      {isAddingChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Add Marketing Channel</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Channel Name</label>
                <input
                  type="text"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., TikTok Ads"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Monthly Spend ($)</label>
                <input
                  type="number"
                  value={newChannel.spend}
                  onChange={(e) => setNewChannel({ ...newChannel, spend: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Conversions</label>
                <input
                  type="number"
                  value={newChannel.conversions}
                  onChange={(e) => setNewChannel({ ...newChannel, conversions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsAddingChannel(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChannel}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Add Channel
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CAC