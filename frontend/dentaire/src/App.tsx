import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Treatments from './pages/Treatments'

import Layout from './components/Layout'
import Appointment from './pages/Appointment'
import WaitingQueue from './pages/WaitingQueue'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="appointments" element={<Appointment />} />
            <Route path="waiting-queue" element={<WaitingQueue />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}