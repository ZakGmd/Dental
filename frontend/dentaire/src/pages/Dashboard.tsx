import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react'

const API_URL = 'http://localhost:8081/api'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change && change > 0

  return (
    <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-6 
                    transition-all duration-300 ease-out cursor-pointer
                    hover:border-[#2a2a2a] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} strokeWidth={1.5} className={iconColor} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-[11px] font-medium tracking-[0.02em]
                          ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-[32px] font-semibold tracking-[-0.03em] leading-none text-white mb-2">
        {value}
      </p>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
        {label}
      </p>
    </div>
  )
}

// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#111111] border border-[#1c1c1c] 
                    rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
          <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-neutral-400 hover:text-white hover:bg-[#1a1a1a]
                     transition-all duration-200"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

interface Appointment {
  id: number
  patient: {
    firstName: string
    lastName: string
  }
  dateTime: string
  status: string
  notes: string
}

interface Patient {
  id: number
  firstName: string
  lastName: string
}

// Form interfaces
interface PatientForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  address: string
}

interface AppointmentForm {
  patientId: string
  dateTime: string
  status: string
  notes: string
}

const initialPatientForm: PatientForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  address: '',
}

const initialAppointmentForm: AppointmentForm = {
  patientId: '',
  dateTime: '',
  status: 'SCHEDULED',
  notes: '',
}

export default function Dashboard() {
  const queryClient = useQueryClient()
  
  // Modal states
  const [patientModalOpen, setPatientModalOpen] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [queueModalOpen, setQueueModalOpen] = useState(false)
  
  // Form states
  const [patientForm, setPatientForm] = useState<PatientForm>(initialPatientForm)
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>(initialAppointmentForm)
  const [selectedPatientId, setSelectedPatientId] = useState('')

  // Fetch patients count
  const { data: patientsCount } = useQuery({
    queryKey: ['patients', 'count'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/patients/count`)
      return res.json()
    },
  })

  // Fetch treatments count
  const { data: treatmentsCount } = useQuery({
    queryKey: ['treatments', 'count'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/treatments/count`)
      return res.json()
    },
  })

  // Fetch today's appointments
  const { data: todayAppointments } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/appointments/today`)
      return res.json()
    },
  })

  // Fetch waiting queue size
  const { data: queueSize } = useQuery({
    queryKey: ['queue', 'size'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/waiting-queue/size`)
      return res.json()
    },
  })

  // Fetch all patients for dropdowns
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/patients`)
      return res.json()
    },
  })

  // Create patient mutation
  const createPatientMutation = useMutation({
    mutationFn: async (newPatient: PatientForm) => {
      const res = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      })
      if (!res.ok) throw new Error('Failed to create patient')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setPatientModalOpen(false)
      setPatientForm(initialPatientForm)
    },
  })

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: AppointmentForm) => {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: { id: parseInt(newAppointment.patientId) },
          dateTime: newAppointment.dateTime,
          status: newAppointment.status,
          notes: newAppointment.notes,
        }),
      })
      if (!res.ok) throw new Error('Failed to create appointment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setAppointmentModalOpen(false)
      setAppointmentForm(initialAppointmentForm)
    },
  })

  // Add to queue mutation
  const addToQueueMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const res = await fetch(`${API_URL}/waiting-queue/add/${patientId}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to add to queue')
      return res.text()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      queryClient.invalidateQueries({ queryKey: ['waiting-queue'] })
      setQueueModalOpen(false)
      setSelectedPatientId('')
    },
  })

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPatientMutation.mutate(patientForm)
  }

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAppointmentMutation.mutate(appointmentForm)
  }

  const handleQueueSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPatientId) {
      addToQueueMutation.mutate(selectedPatientId)
    }
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'SCHEDULED': 
        return 'bg-blue-500/10 text-blue-400'
      case 'IN_PROGRESS': 
        return 'bg-amber-500/10 text-amber-400'
      case 'COMPLETED': 
        return 'bg-emerald-500/10 text-emerald-400'
      case 'CANCELLED': 
        return 'bg-red-500/10 text-red-400'
      default: 
        return 'bg-neutral-800 text-neutral-400'
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] leading-tight text-white mb-2">
          Dashboard
        </h1>
        <p className="text-[14px] text-neutral-400 tracking-[-0.01em] leading-relaxed">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          label="Total Patients"
          value={patientsCount ?? 0}
          change={12}
          icon={Users}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          label="Today's Appointments"
          value={todayAppointments?.length ?? 0}
          icon={Calendar}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="In Queue"
          value={queueSize ?? 0}
          icon={Clock}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Treatments"
          value={treatmentsCount ?? 0}
          change={8}
          icon={TrendingUp}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-400"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Today's Schedule */}
        <div className="col-span-2 bg-[#111111] border border-[#1c1c1c] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-white">
              Today's Schedule
            </h3>
            <button className="text-[12px] font-medium tracking-[0.01em] text-blue-400 
                             hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments?.length === 0 && (
              <p className="text-center py-12 text-[13px] text-neutral-500 tracking-[-0.01em]">
                No appointments scheduled for today
              </p>
            )}
            {todayAppointments?.slice(0, 5).map((appointment: Appointment) => (
              <div 
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-xl 
                         bg-[#0a0a0a] border border-[#1c1c1c]
                         hover:border-[#2a2a2a] transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] 
                                flex items-center justify-center">
                    <span className="text-[12px] font-medium tracking-[0.02em] text-white">
                      {appointment.patient.firstName[0]}
                      {appointment.patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium tracking-[-0.01em] text-white">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-[11px] tracking-[0.02em] text-neutral-500">
                      {formatTime(appointment.dateTime)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-[0.02em]
                              ${getStatusStyles(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-6">
          <h3 className="text-[15px] font-medium tracking-[-0.01em] text-white mb-6">
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setPatientModalOpen(true)}
              className="w-full px-4 py-3 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                       flex items-center justify-center gap-2"
            >
              <Users size={16} strokeWidth={1.5} />
              New Patient
            </button>
            
            <button 
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200
                       hover:border-[#2a2a2a] hover:bg-[#1a1a1a]
                       flex items-center justify-center gap-2"
            >
              <Calendar size={16} strokeWidth={1.5} />
              New Appointment
            </button>
            
            <button 
              onClick={() => setQueueModalOpen(true)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200
                       hover:border-[#2a2a2a] hover:bg-[#1a1a1a]
                       flex items-center justify-center gap-2"
            >
              <Clock size={16} strokeWidth={1.5} />
              Add to Queue
            </button>
          </div>

          {/* Queue Preview */}
          <div className="mt-8 pt-6 border-t border-[#1c1c1c]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                Current Queue
              </p>
              <span className="text-[11px] font-medium tracking-[0.02em] text-amber-400">
                {queueSize ?? 0} waiting
              </span>
            </div>
            
            <div className="flex -space-x-2">
              {[...Array(Math.min(queueSize ?? 0, 5))].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#111111]
                           flex items-center justify-center"
                >
                  <span className="text-[10px] font-medium text-white">{i + 1}</span>
                </div>
              ))}
              {(queueSize ?? 0) > 5 && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-[#111111]
                             flex items-center justify-center">
                  <span className="text-[10px] font-medium text-blue-400">
                    +{(queueSize ?? 0) - 5}
                  </span>
                </div>
              )}
              {(queueSize ?? 0) === 0 && (
                <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                  Queue is empty
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Patient Modal */}
      <Modal 
        isOpen={patientModalOpen} 
        onClose={() => {
          setPatientModalOpen(false)
          setPatientForm(initialPatientForm)
        }}
        title="New Patient"
      >
        <form onSubmit={handlePatientSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                              text-neutral-500 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={patientForm.firstName}
                onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                         text-[13px] text-white tracking-[-0.01em]
                         focus:outline-none focus:border-[#2a2a2a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                              text-neutral-500 mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                value={patientForm.lastName}
                onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                         text-[13px] text-white tracking-[-0.01em]
                         focus:outline-none focus:border-[#2a2a2a] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Phone
            </label>
            <input
              type="tel"
              required
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={patientForm.birthDate}
              onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Address
            </label>
            <input
              type="text"
              value={patientForm.address}
              onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setPatientModalOpen(false)
                setPatientForm(initialPatientForm)
              }}
              className="flex-1 px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200 hover:border-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPatientMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 disabled:opacity-50"
            >
              {createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* New Appointment Modal */}
      <Modal 
        isOpen={appointmentModalOpen} 
        onClose={() => {
          setAppointmentModalOpen(false)
          setAppointmentForm(initialAppointmentForm)
        }}
        title="New Appointment"
      >
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Patient
            </label>
            <select
              required
              value={appointmentForm.patientId}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            >
              <option value="">Select patient...</option>
              {patients?.map((patient: Patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={appointmentForm.dateTime}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, dateTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Notes
            </label>
            <textarea
              value={appointmentForm.notes}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em] resize-none
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setAppointmentModalOpen(false)
                setAppointmentForm(initialAppointmentForm)
              }}
              className="flex-1 px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200 hover:border-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 disabled:opacity-50"
            >
              {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add to Queue Modal */}
      <Modal 
        isOpen={queueModalOpen} 
        onClose={() => {
          setQueueModalOpen(false)
          setSelectedPatientId('')
        }}
        title="Add to Queue"
      >
        <form onSubmit={handleQueueSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Select Patient
            </label>
            <select
              required
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            >
              <option value="">Select patient...</option>
              {patients?.map((patient: Patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 
                            flex items-center justify-center">
                <Clock size={18} strokeWidth={1.5} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.01em] text-white">
                  Current Queue Size
                </p>
                <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                  {queueSize ?? 0} patients waiting • Est. wait ~{(queueSize ?? 0) * 15} min
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setQueueModalOpen(false)
                setSelectedPatientId('')
              }}
              className="flex-1 px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200 hover:border-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addToQueueMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 disabled:opacity-50"
            >
              {addToQueueMutation.isPending ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}