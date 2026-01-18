'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, AlertCircle, Loader2 } from 'lucide-react'
import Input from '@/components/InputForm'
import { TextareaInput } from '@/components/textarea'
import Button from '@/components/button'
import { useToast } from '@/components/Toats'
import { useLoans } from '../hooks'
import * as equipmentService from '@/Service/equipmentService'

export default function AjukanPinjamanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const { createLoan } = useLoans()
  // Support both productId (from product page) and equipmentId
  const equipmentId = searchParams.get('equipmentId') || searchParams.get('productId')

  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    tanggal_deadline: '',
    alasan: '',
    jumlah: '1',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get minimum return date (tomorrow)
  const getMinReturnDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  useEffect(() => {
    // Fetch equipment by ID
    if (equipmentId) {
      fetchEquipment()
    } else {
      setLoading(false)
    }
  }, [equipmentId])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const data = await equipmentService.getEquipmentById(equipmentId)
      setEquipment(data)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
      toast.error('Error', 'Gagal memuat data alat')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.tanggal_deadline) {
      newErrors.tanggal_deadline = 'Tanggal pengembalian wajib diisi'
    } else {
      const deadline = new Date(formData.tanggal_deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadline <= today) {
        newErrors.tanggal_deadline = 'Tanggal pengembalian harus setelah hari ini'
      }
    }

    if (!formData.jumlah || parseInt(formData.jumlah) < 1) {
      newErrors.jumlah = 'Jumlah wajib diisi dan minimal 1'
    } else if (equipment && parseInt(formData.jumlah) > equipment.stok) {
      newErrors.jumlah = `Jumlah tidak boleh melebihi stok tersedia (${equipment.stok})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createLoan({
        equipment_id: equipmentId,
        jumlah: parseInt(formData.jumlah),
        tanggal_deadline: formData.tanggal_deadline,
      })

      // Redirect to pinjaman page
      setTimeout(() => {
        router.push('/peminjam/pinjaman')
      }, 500)
    } catch (error) {
      // Error already handled by hook
      console.error('Error submitting loan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Alat tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">Alat yang Anda cari tidak tersedia</p>
          <Link
            href="/peminjam/product"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog Produk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/peminjam/product"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Form Pengajuan Peminjaman</h1>
          <p className="text-slate-500 mt-1">Lengkapi form di bawah ini untuk mengajukan peminjaman</p>
        </div>

        {/* Product Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              {equipment.image ? (
                <img
                  src={equipment.image}
                  alt={equipment.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-1">{equipment.nama}</h2>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{equipment.deskripsi || '-'}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Stok: <span className="font-semibold text-slate-900">{equipment.stok} unit</span>
                  </span>
                </div>
                <span className="text-sm text-slate-500">•</span>
                <span className="text-sm text-slate-600">{equipment.kategori?.nama || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8 space-y-6">
          {/* Tanggal Pengembalian */}
          <div>
            <Input
              type="date"
              label="Tanggal Deadline Pengembalian"
              name="tanggal_deadline"
              value={formData.tanggal_deadline}
              onChange={handleChange}
              required
              fullWidth
              size="md"
              rounded="xl"
              error={errors.tanggal_deadline}
              min={getMinReturnDate()}
              helperText="Pilih tanggal kapan Anda akan mengembalikan alat"
            />
          </div>

          {/* Jumlah */}
          <div>
            <Input
              type="number"
              label="Jumlah yang Ingin Dipinjam"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              required
              fullWidth
              size="md"
              rounded="xl"
              error={errors.jumlah}
              min="1"
              max={equipment.stok}
              helperText={`Maksimal: ${equipment.stok} unit (stok tersedia)`}
            />
          </div>

          {/* Alasan Meminjam (Optional - untuk catatan user) */}
          <div>
            <TextareaInput
              label="Alasan Meminjam (Opsional)"
              name="alasan"
              value={formData.alasan}
              onChange={handleChange}
              rows={5}
              maxLength={500}
              showCount
              placeholder="Jelaskan alasan Anda meminjam alat ini..."
              helperText="Catatan untuk diri sendiri (opsional)"
            />
          </div>

          {/* Info Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Perhatian</p>
              <p>
                Pastikan informasi yang Anda isi sudah benar. Pengajuan peminjaman akan ditinjau oleh petugas sebelum
                disetujui.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="lg"
              rounded="xl"
              onClick={() => router.back()}
              className="flex-1"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              rounded="xl"
              disabled={isSubmitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim...</span>
                </div>
              ) : (
                'Ajukan Peminjaman'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
