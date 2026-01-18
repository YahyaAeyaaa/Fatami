'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toats'

export default function AlatPage() {
  const toast = useToast()
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [formData, setFormData] = useState({
    jumlah: '1',
    tanggal_deadline: '',
  })

  useEffect(() => {
    fetchEquipments()
  }, [])

  const fetchEquipments = async () => {
    try {
      const res = await fetch('/api/equipments')
      const data = await res.json()
      setEquipments(data.filter((eq) => eq.stok > 0))
    } catch (error) {
      console.error('Failed to fetch equipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePinjam = (equipment) => {
    setSelectedEquipment(equipment)
    setFormData({ jumlah: '1', tanggal_deadline: '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: selectedEquipment.id,
          jumlah: formData.jumlah,
          tanggal_deadline: formData.tanggal_deadline,
        }),
      })

      if (res.ok) {
        setShowModal(false)
        setSelectedEquipment(null)
        toast.success('Berhasil!', 'Peminjaman berhasil diajukan')
        fetchEquipments()
      } else {
        const data = await res.json()
        toast.error('Gagal', data.error || 'Gagal mengajukan peminjaman')
      }
    } catch (error) {
      console.error('Failed to create loan:', error)
      toast.error('Gagal', 'Gagal mengajukan peminjaman')
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Alat</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipments.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{equipment.nama}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Kategori: {equipment.kategori?.nama || '-'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Kode: {equipment.kode_alat || '-'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Stok: {equipment.stok}
            </p>
            {equipment.deskripsi && (
              <p className="text-sm text-gray-600 mb-4">{equipment.deskripsi}</p>
            )}
            <button
              onClick={() => handlePinjam(equipment)}
              disabled={equipment.stok === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Pinjam
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedEquipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-xl font-bold mb-4">
              Pinjam: {selectedEquipment.nama}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) =>
                    setFormData({ ...formData, jumlah: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max={selectedEquipment.stok}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal: {selectedEquipment.stok}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline Pengembalian
                </label>
                <input
                  type="date"
                  value={formData.tanggal_deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal_deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedEquipment(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ajukan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

