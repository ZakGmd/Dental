import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-['Inter',system-ui,sans-serif] antialiased">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}