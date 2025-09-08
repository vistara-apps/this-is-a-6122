import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout