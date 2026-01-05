import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Treatments', href: '/treatments', icon: Stethoscope },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Waiting Queue', href: '/waiting-queue', icon: Clock },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111111] border-r border-[#1c1c1c]">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Stethoscope size={18} strokeWidth={1.5} className="text-blue-500" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            Dentaire
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <p className="px-4 mb-4 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
          Menu
        </p>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] rounded-xl transition-all duration-200
               ${isActive 
                 ? 'text-white bg-[#1a1a1a]' 
                 : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]/50'
               }`
            }
          >
            <item.icon size={18} strokeWidth={1.5} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1c1c1c]">
        <NavLink 
          to="/settings" 
          className="flex items-center gap-3 px-4 py-3 text-[13px] font-medium tracking-[-0.01em] 
                     text-neutral-400 rounded-xl transition-all duration-200
                     hover:text-white hover:bg-[#1a1a1a]/50"
        >
          <Settings size={18} strokeWidth={1.5} />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}