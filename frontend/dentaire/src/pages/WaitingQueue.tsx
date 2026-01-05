import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { 
  Clock, 
  UserPlus, 
  PhoneCall, 
  Trash2,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Modal from '../components/Modal'

const API_URL = 'http://localhost:8081/api'

interface Patient {
  id: number
  firstName: string
  lastName: string
  phone: string
}

export default function WaitingQueue() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')

  // Fetch waiting queue
  const { data: queue, isLoading: queueLoading } = useQuery({
    queryKey: ['waiting-queue'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/waiting-queue`)
      return res.json()
    },
  })

  // Fetch queue size
  const { data: queueSize } = useQuery({
    queryKey: ['waiting-queue', 'size'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/waiting-queue/size`)
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

  // Add to queue
  const addMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const res = await fetch(`${API_URL}/waiting-queue/add/${patientId}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to add to queue')
      return res.text()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queue'] })
      setIsModalOpen(false)
      setSelectedPatientId('')
    },
  })

  // Call next patient
  const callNextMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/waiting-queue/call-next`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to call next')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queue'] })
    },
  })

  // Remove from queue
  const removeMutation = useMutation({
    mutationFn: async (patientId: number) => {
      const res = await fetch(`${API_URL}/waiting-queue/remove/${patientId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to remove from queue')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queue'] })
    },
  })

  // Clear queue
  const clearMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/waiting-queue/clear`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to clear queue')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queue'] })
    },
  })

  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPatientId) {
      addMutation.mutate(selectedPatientId)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-2">
            Waiting Queue
          </h1>
          <p className="text-[14px] text-neutral-400 tracking-[-0.01em]">
            Manage today's waiting room
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => clearMutation.mutate()}
            disabled={!queueSize || queueSize === 0}
            className="px-4 py-2.5 bg-[#111111] border border-[#1c1c1c] 
                     text-neutral-400 text-[13px] font-medium tracking-[-0.01em] rounded-xl 
                     transition-all duration-200 hover:border-red-500/30 hover:text-red-400
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Clear All
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                     tracking-[-0.01em] rounded-xl transition-all duration-200
                     hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                     flex items-center gap-2"
          >
            <UserPlus size={16} strokeWidth={1.5} />
            Add to Queue
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 
                          flex items-center justify-center">
              <Users size={18} strokeWidth={1.5} className="text-amber-400" />
            </div>
          </div>
          <p className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-1">
            {queueSize ?? 0}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            In Queue
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 
                          flex items-center justify-center">
              <Clock size={18} strokeWidth={1.5} className="text-blue-400" />
            </div>
          </div>
          <p className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-1">
            ~{(queueSize ?? 0) * 15}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Est. Wait (min)
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 
                          flex items-center justify-center">
              <CheckCircle size={18} strokeWidth={1.5} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-1">
            {queue?.[0] ? `${queue[0].firstName}` : '-'}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Next Patient
          </p>
        </div>
      </div>

      {/* Call Next Button */}
      <button
        onClick={() => callNextMutation.mutate()}
        disabled={!queueSize || queueSize === 0 || callNextMutation.isPending}
        className="w-full py-4 bg-emerald-500 text-white text-[14px] font-semibold 
                 tracking-[-0.01em] rounded-2xl transition-all duration-200
                 hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]
                 disabled:opacity-30 disabled:cursor-not-allowed
                 flex items-center justify-center gap-3"
      >
        <PhoneCall size={20} strokeWidth={1.5} />
        {callNextMutation.isPending ? 'Calling...' : 'Call Next Patient'}
      </button>

      {/* Queue List */}
      {queueLoading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : (
        <div className="bg-[#111111] border border-[#1c1c1c] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1c1c1c]">
            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-white">
              Queue Order
            </h3>
          </div>

          {queue?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#1c1c1c]
                            flex items-center justify-center mx-auto mb-4">
                <Clock size={24} strokeWidth={1.5} className="text-neutral-500" />
              </div>
              <p className="text-[14px] text-neutral-400 tracking-[-0.01em] mb-1">
                Queue is empty
              </p>
              <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                Add patients to the waiting queue
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1c1c1c]">
              {queue?.map((patient: Patient, index: number) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between px-6 py-4
                           hover:bg-[#1a1a1a]/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {/* Position */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                  ${index === 0 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-[#1a1a1a] text-neutral-400'
                                  }`}>
                      <span className="text-[14px] font-semibold">
                        {index + 1}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div>
                      <p className="text-[14px] font-medium tracking-[-0.01em] text-white">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                        {patient.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 
                                     text-[10px] font-medium tracking-[0.04em] text-emerald-400">
                        NEXT
                      </span>
                    )}
                    
                    <span className="text-[12px] text-neutral-500 tracking-[-0.01em]">
                      ~{index * 15} min wait
                    </span>

                    <button 
                      onClick={() => removeMutation.mutate(patient.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                               text-neutral-400 hover:text-red-400 hover:bg-red-500/10
                               transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPatientId('')
        }}
        title="Add to Queue"
      >
        <form onSubmit={handleAddToQueue} className="space-y-4">
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
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
              disabled={addMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-[13px] font-medium 
                       tracking-[-0.01em] rounded-xl transition-all duration-200
                       hover:bg-blue-600 disabled:opacity-50"
            >
              {addMutation.isPending ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}