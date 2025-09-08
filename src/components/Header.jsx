import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'

function Header() {
  return (
    <div className="lg:pl-64">
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-surface border-b border-gray-200 shadow-sm">
        <button
          type="button"
          className="px-4 text-text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1 flex">
            <div className="w-full flex md:ml-0">
              <div className="relative w-full text-text-secondary focus-within:text-text-primary">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-surface placeholder-text-secondary focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search metrics..."
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="bg-surface p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-white">JD</span>
                </div>
                <span className="ml-2 text-sm font-medium text-text-primary hidden md:block">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header