import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'
import Modal from '../components/Modal'

const API_URL = 'http://localhost:8081/api'

interface Patient {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  address: string
  createdAt: string
}

interface PatientForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  address: string
}

const initialForm: PatientForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  address: '',
}

export default function Patients() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [form, setForm] = useState<PatientForm>(initialForm)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch patients
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/patients`)
      return res.json()
    },
  })

  // Create patient
  const createMutation = useMutation({
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
      closeModal()
    },
  })

  // Update patient
  const updateMutation = useMutation({
    mutationFn: async ({ id, patient }: { id: number; patient: PatientForm }) => {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      })
      if (!res.ok) throw new Error('Failed to update patient')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      closeModal()
    },
  })

  // Delete patient
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete patient')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  const openCreateModal = () => {
    setEditingPatient(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient)
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email || '',
      phone: patient.phone,
      birthDate: patient.birthDate || '',
      address: patient.address || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPatient(null)
    setForm(initialForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, patient: form })
    } else {
      createMutation.mutate(form)
    }
  }

  const filteredPatients = patients?.filter((patient: Patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-2">
            Patients
          </h1>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em]">
            Manage your patient records
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
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search 
          size={18} 
          strokeWidth={1.5} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" 
        />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#1c1c1c] rounded-xl
                   text-[13px] text-white placeholder-neutral-500 tracking-[-0.01em]
                   focus:outline-none focus:border-[#2a2a2a] transition-colors"
        />
      </div>

      {/* Patients Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredPatients?.map((patient: Patient) => (
            <div 
              key={patient.id}
              className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-5
                       hover:border-[#2a2a2a] transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] 
                                flex items-center justify-center">
                    <span className="text-[12px] font-medium tracking-[0.02em] text-white">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-white">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-[11px] tracking-[0.02em] text-neutral-500">
                      ID: {patient.id}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(patient)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             text-neutral-400 hover:text-white hover:bg-[#1a1a1a]
                             transition-all duration-200"
                  >
                    <Edit2 size={14} strokeWidth={1.5} />
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(patient.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             text-neutral-400 hover:text-red-400 hover:bg-red-500/10
                             transition-all duration-200"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2.5">
                {patient.email && (
                  <div className="flex items-center gap-2.5 text-[12px] text-neutral-400">
                    <Mail size={14} strokeWidth={1.5} className="text-neutral-500" />
                    <span className="tracking-[-0.01em]">{patient.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-[12px] text-neutral-400">
                  <Phone size={14} strokeWidth={1.5} className="text-neutral-500" />
                  <span className="tracking-[-0.01em]">{patient.phone}</span>
                </div>
                {patient.birthDate && (
                  <div className="flex items-center gap-2.5 text-[12px] text-neutral-400">
                    <Calendar size={14} strokeWidth={1.5} className="text-neutral-500" />
                    <span className="tracking-[-0.01em]">{formatDate(patient.birthDate)}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2.5 text-[12px] text-neutral-400">
                    <MapPin size={14} strokeWidth={1.5} className="text-neutral-500" />
                    <span className="tracking-[-0.01em] truncate">{patient.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPatients?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1c1c1c]
                        flex items-center justify-center mx-auto mb-4">
            <User size={24} strokeWidth={1.5} className="text-neutral-500" />
          </div>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em] mb-1">
            No patients found
          </p>
          <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
            Add your first patient to get started
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingPatient ? 'Edit Patient' : 'New Patient'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                              text-neutral-500 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
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
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
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
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
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
                : editingPatient ? 'Update' : 'Create'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}