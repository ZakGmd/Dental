import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Stethoscope,
  DollarSign,
  Tag,
  FileText
} from 'lucide-react'
import Modal from '../components/Modal'

const API_URL = 'http://localhost:8081/api'

interface Treatment {
  id: number
  name: string
  description: string
  price: number
  code: string
  createdAt: string
}

interface TreatmentForm {
  name: string
  description: string
  price: string
  code: string
}

const initialForm: TreatmentForm = {
  name: '',
  description: '',
  price: '',
  code: '',
}

export default function Treatments() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const [form, setForm] = useState<TreatmentForm>(initialForm)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch treatments
  const { data: treatments, isLoading } = useQuery({
    queryKey: ['treatments'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/treatments`)
      return res.json()
    },
  })

  // Create treatment
  const createMutation = useMutation({
    mutationFn: async (newTreatment: TreatmentForm) => {
      const res = await fetch(`${API_URL}/treatments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTreatment,
          price: parseFloat(newTreatment.price),
        }),
      })
      if (!res.ok) throw new Error('Failed to create treatment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      closeModal()
    },
  })

  // Update treatment
  const updateMutation = useMutation({
    mutationFn: async ({ id, treatment }: { id: number; treatment: TreatmentForm }) => {
      const res = await fetch(`${API_URL}/treatments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...treatment,
          price: parseFloat(treatment.price),
        }),
      })
      if (!res.ok) throw new Error('Failed to update treatment')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
      closeModal()
    },
  })

  // Delete treatment
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/treatments/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete treatment')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
  })

  const openCreateModal = () => {
    setEditingTreatment(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (treatment: Treatment) => {
    setEditingTreatment(treatment)
    setForm({
      name: treatment.name,
      description: treatment.description || '',
      price: treatment.price.toString(),
      code: treatment.code || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTreatment(null)
    setForm(initialForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTreatment) {
      updateMutation.mutate({ id: editingTreatment.id, treatment: form })
    } else {
      createMutation.mutate(form)
    }
  }

  const filteredTreatments = treatments?.filter((treatment: Treatment) =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(price)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-2">
            Treatments
          </h1>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em]">
            Manage dental treatments and pricing
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
          Add Treatment
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
          placeholder="Search treatments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#1c1c1c] rounded-xl
                   text-[13px] text-white placeholder-neutral-500 tracking-[-0.01em]
                   focus:outline-none focus:border-[#2a2a2a] transition-colors"
        />
      </div>

      {/* Treatments Table */}
      {isLoading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : (
        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1c1c1c]">
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase 
                             tracking-[0.1em] text-neutral-500">
                  Treatment
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase 
                             tracking-[0.1em] text-neutral-500">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase 
                             tracking-[0.1em] text-neutral-500">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-medium uppercase 
                             tracking-[0.1em] text-neutral-500">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-medium uppercase 
                             tracking-[0.1em] text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTreatments?.map((treatment: Treatment) => (
                <tr 
                  key={treatment.id}
                  className="border-b border-[#1c1c1c] last:border-b-0 
                           hover:bg-[#1a1a1a]/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 
                                    flex items-center justify-center">
                        <Stethoscope size={16} strokeWidth={1.5} className="text-emerald-400" />
                      </div>
                      <span className="text-[13px] font-medium tracking-[-0.01em] text-white">
                        {treatment.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {treatment.code ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] 
                                     text-[11px] font-medium tracking-[0.02em] text-neutral-300">
                        {treatment.code}
                      </span>
                    ) : (
                      <span className="text-[12px] text-neutral-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-neutral-400 tracking-[-0.01em] line-clamp-1">
                      {treatment.description || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                      {formatPrice(treatment.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(treatment)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-neutral-400 hover:text-white hover:bg-[#1a1a1a]
                                 transition-all duration-200"
                      >
                        <Edit2 size={14} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(treatment.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-neutral-400 hover:text-red-400 hover:bg-red-500/10
                                 transition-all duration-200"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredTreatments?.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c]
                            flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={24} strokeWidth={1.5} className="text-neutral-500" />
              </div>
              <p className="text-[14px] text-neutral-400 tracking-[-0.01em] mb-1">
                No treatments found
              </p>
              <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                Add your first treatment to get started
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingTreatment ? 'Edit Treatment' : 'New Treatment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em]
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Code
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g., CLEAN01"
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em] placeholder-neutral-600
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl
                       text-[13px] text-white tracking-[-0.01em] resize-none
                       focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] 
                            text-neutral-500 mb-2">
              Price (MAD)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                : editingTreatment ? 'Update' : 'Create'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}