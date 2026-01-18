'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, User, X, Mail, UserCircle, Shield, Loader2 } from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import { Dropdown } from '@/components/dropdown'
import Pagination from '@/components/Pagination'
import { useUsers, useUserFilters } from './hooks'

export default function UserPage() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers()
  const { searchQuery, setSearchQuery, filteredUsers } = useUserFilters(users)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nama: '',
    role: 'PEMINJAM',
    is_active: true,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editing) {
        // Update existing user
        const updateData = {
          username: formData.username,
          email: formData.email,
          nama: formData.nama,
          role: formData.role,
          is_active: formData.is_active,
        }

        // Only include password if it's provided
        if (formData.password.trim() !== '') {
          updateData.password = formData.password
        }

        await updateUser(editing, updateData)
      } else {
        // Create new user
        await createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nama: formData.nama,
          role: formData.role,
        })
      }

      setShowModal(false)
      setEditing(null)
      setFormData({
        username: '',
        email: '',
        password: '',
        nama: '',
        role: 'PEMINJAM',
        is_active: true,
      })
    } catch (error) {
      // Error already handled by hook
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (user) => {
    setEditing(user.id)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      nama: user.nama,
      role: user.role,
      is_active: user.is_active,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return

    try {
      await deleteUser(id)
    } catch (error) {
      // Error already handled by hook
      console.error('Error deleting user:', error)
    }
  }

  const handleToggleStatus = async (id) => {
    const user = users.find((u) => u.id === id)
    if (!user) return

    try {
      await updateUser(id, {
        username: user.username,
        email: user.email,
        nama: user.nama,
        role: user.role,
        is_active: !user.is_active,
      })
    } catch (error) {
      // Error already handled by hook
      console.error('Error toggling status:', error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      nama: '',
      role: 'PEMINJAM',
      is_active: true,
    })
  }

  const roleOptions = [
    { value: 'PEMINJAM', label: 'Peminjam' },
    { value: 'PETUGAS', label: 'Petugas' },
  ]

  const getRoleIcon = (role) => {
    return role === 'PETUGAS' ? <Shield className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />
  }

  const getRoleColor = (role) => {
    return role === 'PETUGAS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola akun peminjam dan petugas di sistem</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Cari user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
          rounded="lg"
          size="md"
        />
        <Button
          onClick={() => {
            setEditing(null)
            setFormData({
              username: '',
              email: '',
              password: '',
              nama: '',
              role: 'PEMINJAM',
              is_active: true,
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-[#313c4d]"
          size="md"
        >
          <Plus className="w-4 h-4" />
          <p className="text-sm">Tambah User</p>
        </Button>
      </div>

      {/* Cards Grid */}
      {loading && users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Memuat data...</p>
        </div>
      ) : currentUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#196885] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.nama}</h3>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-[#113e59] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-400 hover:text-[#113e59] transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role === 'PETUGAS' ? 'Petugas' : user.role === 'PEMINJAM' ? 'Peminjam' : user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={loading}
                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                        user.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-400">
                      Dibuat: {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Tidak ada data user</p>
          {searchQuery && <p className="text-gray-400 text-xs mt-1">Coba gunakan kata kunci lain</p>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit User' : 'Tambah User'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  fullWidth
                  disabled={submitting}
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  fullWidth
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="password"
                  label={editing ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editing}
                  fullWidth
                  disabled={submitting}
                />
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  fullWidth
                  disabled={submitting}
                />
              </div>

              <Dropdown
                label="Role"
                options={roleOptions}
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value })}
                placeholder="Pilih role"
                required
                disabled={submitting}
              />

              {editing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#196885] border-gray-300 rounded focus:ring-[#196885]"
                    disabled={submitting}
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Akun Aktif
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editing ? 'Mengupdate...' : 'Menyimpan...'}
                    </span>
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
