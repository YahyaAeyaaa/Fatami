'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Package, X } from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import { Dropdown } from '@/components/dropdown'
import { TextareaInput } from '@/components/textarea'
import { ImageInput } from '@/components/imageinput'
import Pagination from '@/components/Pagination'
import { ModalDelete } from '@/components/modaldelet'
import { useEquipments } from './hooks/useEquipments'
import { useEquipmentFilters } from './hooks/useEquipmentFilters'
import { useCategories } from './hooks/useCategories'

export default function AlatPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    kode_alat: '',
    kategori_id: '',
    stok: '0',
    deskripsi: '',
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingEquipment, setDeletingEquipment] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Use custom hooks
  const { equipments, loading, error, fetchEquipments, createEquipment, updateEquipment, deleteEquipment } = useEquipments()
  const { categories, fetchCategories } = useCategories()
  const { searchQuery, pagination, handleSearch, handlePageChange } = useEquipmentFilters(equipments)

  // Fetch data on mount
  useEffect(() => {
    fetchEquipments()
    fetchCategories()
  }, [fetchEquipments, fetchCategories])

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      const equipmentData = {
        nama: formData.nama,
        kode_alat: formData.kode_alat || undefined,
        kategori_id: formData.kategori_id,
        stok: parseInt(formData.stok),
        deskripsi: formData.deskripsi || undefined,
        image: imagePreview || undefined,
      }

      if (editing) {
        await updateEquipment(editing, equipmentData)
      } else {
        await createEquipment(equipmentData)
      }

      // Close modal and reset form
      setShowModal(false)
      setEditing(null)
      setImagePreview(null)
      setFormData({ nama: '', kode_alat: '', kategori_id: '', stok: '0', deskripsi: '' })

      // Refresh data from server
      await fetchEquipments()
    } catch (err) {
      // Error handling is done in the hook
      console.error('Error submitting equipment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (equipment) => {
    setEditing(equipment.id)
    setFormData({
      nama: equipment.nama,
      kode_alat: equipment.kode_alat || '',
      kategori_id: equipment.kategori_id,
      stok: equipment.stok.toString(),
      deskripsi: equipment.deskripsi || '',
    })
    setImagePreview(equipment.image || null)
    setShowModal(true)
  }

  const handleDeleteClick = (equipment) => {
    setDeletingEquipment(equipment)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingEquipment) return

    try {
      setIsDeleting(true)
      await deleteEquipment(deletingEquipment.id)
      // Refresh data from server
      await fetchEquipments()
      // Close modal
      setDeleteModalOpen(false)
      setDeletingEquipment(null)
    } catch (err) {
      // Error handling is done in the hook
      console.error('Error deleting equipment:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteModalClose = () => {
    if (isDeleting) return
    setDeleteModalOpen(false)
    setDeletingEquipment(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
    setImagePreview(null)
    setFormData({ nama: '', kode_alat: '', kategori_id: '', stok: '0', deskripsi: '' })
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.nama,
  }))

  const getStokColor = (stok) => {
    if (stok === 0) return 'bg-red-100 text-red-800'
    if (stok < 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  // Show loading state
  if (loading && equipments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#196885] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data alat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Alat</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data alat yang tersedia di sistem</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Cari alat..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
          rounded="lg"
          size="md"
        />
        <Button
          onClick={() => {
            setEditing(null)
            setImagePreview(null)
            setFormData({ nama: '', kode_alat: '', kategori_id: '', stok: '0', deskripsi: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-[#313c4d]"
          size="md"
        >
          <Plus className="w-4 h-4" />
          <p className="text-sm">Tambah Alat</p>
        </Button>
      </div>

      {/* Cards Grid */}
      {pagination.currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagination.currentItems.map((equipment) => (
              <div
                key={equipment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                {equipment.image ? (
                  <div className="w-full h-48 overflow-hidden bg-gray-100">
                    <img
                      src={equipment.image}
                      alt={equipment.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{equipment.nama}</h3>
                      <p className="text-sm text-gray-500">{equipment.kode_alat || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(equipment)}
                        className="text-gray-400 hover:text-[#113e59] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(equipment)}
                        className="text-gray-400 hover:text-[#113e59] transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Kategori</span>
                      <span className="text-sm font-medium text-gray-900">
                        {equipment.kategori?.nama || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Stok</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStokColor(
                          equipment.stok
                        )}`}
                      >
                        {equipment.stok} unit
                      </span>
                    </div>
                    {equipment.deskripsi && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Deskripsi</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{equipment.deskripsi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalItems > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={6}
                totalItems={pagination.totalItems}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Tidak ada data alat</p>
          {searchQuery && (
            <p className="text-gray-400 text-xs mt-1">Coba gunakan kata kunci lain</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Alat' : 'Tambah Alat'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Alat"
                  placeholder="Masukkan nama alat"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  fullWidth
                />
                <Input
                  label="Kode Alat"
                  placeholder="Masukkan kode alat (opsional)"
                  value={formData.kode_alat}
                  onChange={(e) => setFormData({ ...formData, kode_alat: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  label="Kategori"
                  options={categoryOptions}
                  value={formData.kategori_id}
                  onChange={(value) => setFormData({ ...formData, kategori_id: value })}
                  placeholder="Pilih kategori"
                  required
                />
                <Input
                  type="number"
                  label="Stok"
                  placeholder="Masukkan jumlah stok"
                  value={formData.stok}
                  onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                  required
                  fullWidth
                  min="0"
                />
              </div>

              <TextareaInput
                label="Deskripsi"
                placeholder="Masukkan deskripsi alat (opsional)"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={4}
              />

              <ImageInput
                label="Gambar Alat"
                value={imagePreview}
                onChange={handleImageChange}
                placeholder="Klik atau drag gambar ke sini"
                maxSize={5}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" disabled={submitting} className="min-w-[100px]">
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{editing ? 'Updating...' : 'Menyimpan...'}</span>
                    </div>
                  ) : (
                    editing ? 'Update' : 'Simpan'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ModalDelete
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Hapus Alat"
        message="Apakah Anda yakin ingin menghapus alat ini? Tindakan ini tidak dapat dibatalkan."
        itemName={deletingEquipment?.nama || ''}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />
    </div>
  )
}
