'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import Pagination from '@/components/Pagination'
import { useCategories } from './hooks/useCategories'
import { useCategoryFilters } from './hooks/useCategoryFilters'

export default function KategoriPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nama: '', deskripsi: '' })
  const [submitting, setSubmitting] = useState(false)

  // Use custom hooks
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()
  const { searchQuery, pagination, handleSearch, handlePageChange } = useCategoryFilters(categories)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      if (editing) {
        await updateCategory(editing, {
          nama: formData.nama,
          deskripsi: formData.deskripsi,
        })
      } else {
        await createCategory({
          nama: formData.nama,
          deskripsi: formData.deskripsi,
        })
      }

      // Close modal and reset form
      setShowModal(false)
      setEditing(null)
      setFormData({ nama: '', deskripsi: '' })

      // Refresh data from server
      await fetchCategories()
    } catch (err) {
      // Error handling is done in the hook
      console.error('Error submitting category:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category) => {
    setEditing(category.id)
    setFormData({ nama: category.nama, deskripsi: category.deskripsi || '' })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return

    try {
      await deleteCategory(id)
      // Refresh data from server
      await fetchCategories()
    } catch (err) {
      // Error handling is done in the hook
      console.error('Error deleting category:', err)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
    setFormData({ nama: '', deskripsi: '' })
  }

  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#196885] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data kategori...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola kategori alat yang tersedia di sistem
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Cari kategori..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
          rounded="lg"
          size="md"
        />
        <Button
          onClick={() => {
            setEditing(null)
            setFormData({ nama: '', deskripsi: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-[#313c4d]"
          size="md"
        >
          <Plus className="w-4 h-4" />
          <p className="text-sm">Tambah Kategori</p>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Alat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Dibuat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.currentItems.length > 0 ? (
                pagination.currentItems.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.nama}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {category.deskripsi || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {category._count?.equipments || 0} alat
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-gray-400 hover:text-[#113e59] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-gray-400 hover:text-[#113e59] transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-500 text-sm">Tidak ada data kategori</p>
                      {searchQuery && (
                        <p className="text-gray-400 text-xs mt-1">
                          Coba gunakan kata kunci lain
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={5}
            totalItems={pagination.totalItems}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Nama Kategori"
                placeholder="Masukkan nama kategori"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
                fullWidth
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Masukkan deskripsi kategori"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#196885] focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="min-w-[100px]"
                >
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
    </div>
  )
}
