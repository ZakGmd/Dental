import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  User,
  FileText,
  ChevronDown
} from 'lucide-react'
import Modal from '../components/Modal'

const API_URL = 'http://localhost:8081/api'

interface Patient {
  id: number
  firstName: string
  lastName: string
}

interface Appointment {
  id: number
  patient: Patient
  dateTime: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes: string
}

interface AppointmentForm {
  patientId: string
  dateTime: string
  status: string
  notes: string
}

const initialForm: AppointmentForm = {
  patientId: '',
  dateTime: '',
  status: 'SCHEDULED',
  notes: '',
}

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500/10 text-amber-400' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500/10 text-red-400' },
  { value: 'NO_SHOW', label: 'No Show', color: 'bg-neutral-500/10 text-neutral-400' },
]

export default function Appointments() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [form, setForm] = useState<AppointmentForm>(initialForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Fetch appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/appointments`)
      return res.json()
    },
  })

  // Fetch patients for dropdown
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/patients`)
      return res.json()
    },
  })

  // Create appointment
  const createMutation = useMutation({
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
      closeModal()
    },
  })

  // Update appointment
  const updateMutation = useMutation({
    mutationFn: async ({ id, appointment }: { id: number; appointment: AppointmentForm }) => {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: { id: parseInt(appointment.patientId) },
          dateTime: appointment.dateTime,
          status: appointment.status,
          notes: appointment.notes,
        }),
      })
      if (!res.ok) throw new Error('Failed to update appointment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      closeModal()
    },
  })

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`${API_URL}/appointments/${id}/status?status=${status}`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Failed to update status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })

  // Delete appointment
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete appointment')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })

  const openCreateModal = () => {
    setEditingAppointment(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setForm({
      patientId: appointment.patient.id.toString(),
      dateTime: appointment.dateTime.slice(0, 16),
      status: appointment.status,
      notes: appointment.notes || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAppointment(null)
    setForm(initialForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, appointment: form })
    } else {
      createMutation.mutate(form)
    }
  }

  const getStatusStyle = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-neutral-500/10 text-neutral-400'
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const filteredAppointments = appointments?.filter((apt: Appointment) => {
    const matchesSearch = `${apt.patient.firstName} ${apt.patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-2">
            Appointments
          </h1>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em]">
            Schedule and manage appointments
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                   tracking-[-0.01em] rounded-xl transition-all duration-200
                   hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                   flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={1.5} />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search 
            size={18} 
            strokeWidth={1.5} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" 
          />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#1c1c1c] rounded-xl
                     text-[13px] text-white placeholder-neutral-500 tracking-[-0.01em]
                     focus:outline-none focus:border-[#2a2a2a] transition-colors"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[#111111] border border-[#1c1c1c] rounded-xl
                   text-[13px] text-white tracking-[-0.01em]
                   focus:outline-none focus:border-[#2a2a2a] transition-colors
                   appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="ALL">All Status</option>
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments?.map((appointment: Appointment) => {
            const { date, time } = formatDateTime(appointment.dateTime)
            return (
              <div 
                key={appointment.id}
                className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-5
                         hover:border-[#2a2a2a] transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Date/Time */}
                    <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] 
                                  flex flex-col items-center justify-center">
                      <span className="text-[11px] text-neutral-500 tracking-[0.02em]">
                        {time}
                      </span>
                      <span className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                        {date.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-neutral-500 tracking-[0.02em]">
                        {date.split(' ')[1]}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div>
                      <p className="text-[14px] font-medium tracking-[-0.01em] text-white mb-1">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      {appointment.notes && (
                        <p className="text-[12px] text-neutral-500 tracking-[-0.01em] line-clamp-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Dropdown */}
                    <select
                      value={appointment.status}
                      onChange={(e) => updateStatusMutation.mutate({ 
                        id: appointment.id, 
                        status: e.target.value 
                      })}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-[0.02em]
                               border-0 cursor-pointer appearance-none
                               ${getStatusStyle(appointment.status)}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(appointment)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-neutral-400 hover:text-white hover:bg-[#1a1a1a]
                                 transition-all duration-200"
                      >
                        <Edit2 size={14} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(appointment.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-neutral-400 hover:text-red-400 hover:bg-red-500/10
                                 transition-all duration-200"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAppointments?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1c1c1c]
                        flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} strokeWidth={1.5} className="text-neutral-500" />
          </div>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em] mb-1">
            No appointments found
          </p>
          <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
            Schedule your first appointment
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Patient
            </label>
            <select
              required
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
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
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em] resize-none
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] 
                       text-white text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                       transition-all duration-200 hover:border-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Saving...' 
                : editingAppointment ? 'Update' : 'Create'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}