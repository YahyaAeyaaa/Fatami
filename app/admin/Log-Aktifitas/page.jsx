'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  User,
  Search,
  X,
  Loader2,
  Eye,
  Plus,
  Edit2,
  FileText,
  Tag,
  Users,
} from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import { Dropdown } from '@/components/dropdown'
import { useActivities, useActivityFilters, useActivityUtils } from './hooks'

export default function LogAktifitasPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activityFilter, setActivityFilter] = useState('ALL')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { activities, loading, fetchActivities } = useActivities()
  const { filteredActivities, stats } = useActivityFilters(activities, searchQuery, activityFilter)
  const {
    formatDateTime,
    formatDateShort,
    getActivityTypeLabel,
    getColorClasses,
    activityOptions,
  } = useActivityUtils()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const handleRowClick = (activity) => {
    setSelectedActivity(activity)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Log Aktifitas</h1>
            <p className="text-slate-500 mt-1">
              Rekam aktivitas admin: pembuatan dan perubahan data alat, kategori, dan user
            </p>
          </div>
          <Button
            onClick={fetchActivities}
            variant="outline"
            size="md"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Aktivitas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.equipments}</p>
                <p className="text-sm text-slate-500">Aktivitas Alat</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                <p className="text-sm text-slate-500">Aktivitas Kategori</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
                <p className="text-sm text-slate-500">Aktivitas User</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Cari nama alat, kategori, user, atau deskripsi aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              rounded="lg"
              size="md"
            />
          </div>
          <div className="w-full sm:w-64">
            <Dropdown
              options={activityOptions}
              value={activityFilter}
              onChange={(value) => setActivityFilter(value)}
              placeholder="Filter Tipe Aktivitas"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : filteredActivities.length > 0 ? (
          /* Table */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Aktivitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredActivities.map((activity) => {
                    const colorClasses = getColorClasses(activity.color)
                    const ActivityIcon = activity.icon

                    return (
                      <tr
                        key={activity.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(activity)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{formatDateShort(activity.timestamp)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses.badge}`}
                          >
                            {getActivityTypeLabel(activity.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                          <div className="text-sm text-slate-500 mt-1">{activity.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          {activity.targetType === 'EQUIPMENT' && (
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {activity.target?.nama || '-'}
                              </div>
                              {activity.target?.kategori && (
                                <div className="text-xs text-slate-500">
                                  {activity.target.kategori.nama}
                                </div>
                              )}
                              {activity.target?.stok !== undefined && (
                                <div className="text-xs text-slate-500">Stok: {activity.target.stok}</div>
                              )}
                            </div>
                          )}
                          {activity.targetType === 'CATEGORY' && (
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {activity.target?.nama || '-'}
                              </div>
                              {activity.target?.deskripsi && (
                                <div className="text-xs text-slate-500 line-clamp-1">
                                  {activity.target.deskripsi}
                                </div>
                              )}
                            </div>
                          )}
                          {activity.targetType === 'USER' && (
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {activity.target?.nama || '-'}
                              </div>
                              <div className="text-xs text-slate-500">
                                @{activity.target?.username || '-'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {activity.target?.role === 'PETUGAS' ? 'Petugas' : 'Peminjam'}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(activity)
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-[#113e59] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchQuery || activityFilter !== 'ALL'
                ? 'Tidak ada aktivitas yang sesuai'
                : 'Belum ada log aktivitas'}
            </h3>
            <p className="text-slate-500 max-w-md">
              {searchQuery || activityFilter !== 'ALL'
                ? 'Coba ubah kata kunci pencarian atau filter tipe aktivitas'
                : 'Log aktivitas akan muncul di sini ketika admin melakukan aktivitas (membuat/mengubah alat, kategori, atau user)'}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">Detail Aktivitas</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedActivity(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Activity Info */}
                <div className={`p-4 rounded-xl border ${getColorClasses(selectedActivity.color).bg} ${getColorClasses(selectedActivity.color).border}`}>
                  <div className="flex items-start gap-4">
                    {(() => {
                      const ActivityIcon = selectedActivity.icon
                      return (
                        <div className={`p-3 rounded-lg ${getColorClasses(selectedActivity.color).bg}`}>
                          <ActivityIcon className={`w-6 h-6 ${getColorClasses(selectedActivity.color).icon}`} />
                        </div>
                      )
                    })()}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedActivity.title}</h3>
                      <p className="text-sm text-slate-700">{selectedActivity.description}</p>
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getColorClasses(selectedActivity.color).badge}`}
                        >
                          {getActivityTypeLabel(selectedActivity.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Info */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Waktu Aktivitas</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(selectedActivity.timestamp)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatDateShort(selectedActivity.timestamp)}
                  </p>
                </div>

                {/* Equipment Detail */}
                {selectedActivity.targetType === 'EQUIPMENT' && selectedActivity.target && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-3">Detail Alat</p>
                      <div className="flex items-start gap-4">
                        {selectedActivity.target.image ? (
                          <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={selectedActivity.target.image}
                              alt={selectedActivity.target.nama}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-xs text-slate-500">Nama Alat</p>
                            <p className="font-medium text-slate-900">{selectedActivity.target.nama}</p>
                          </div>
                          {selectedActivity.target.kode_alat && (
                            <div>
                              <p className="text-xs text-slate-500">Kode Alat</p>
                              <p className="text-sm text-slate-900">{selectedActivity.target.kode_alat}</p>
                            </div>
                          )}
                          {selectedActivity.target.kategori && (
                            <div>
                              <p className="text-xs text-slate-500">Kategori</p>
                              <p className="text-sm text-slate-900">{selectedActivity.target.kategori.nama}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-slate-500">Stok</p>
                            <p className="text-sm text-slate-900">{selectedActivity.target.stok} unit</p>
                          </div>
                          {selectedActivity.target.deskripsi && (
                            <div>
                              <p className="text-xs text-slate-500">Deskripsi</p>
                              <p className="text-sm text-slate-900">{selectedActivity.target.deskripsi}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Detail */}
                {selectedActivity.targetType === 'CATEGORY' && selectedActivity.target && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-3">Detail Kategori</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-500">Nama Kategori</p>
                        <p className="font-medium text-slate-900">{selectedActivity.target.nama}</p>
                      </div>
                      {selectedActivity.target.deskripsi && (
                        <div>
                          <p className="text-xs text-slate-500">Deskripsi</p>
                          <p className="text-sm text-slate-900">{selectedActivity.target.deskripsi}</p>
                        </div>
                      )}
                      {selectedActivity.target._count?.equipments !== undefined && (
                        <div>
                          <p className="text-xs text-slate-500">Jumlah Alat</p>
                          <p className="text-sm text-slate-900">
                            {selectedActivity.target._count.equipments} alat
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User Detail */}
                {selectedActivity.targetType === 'USER' && selectedActivity.target && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-3">Detail User</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-500">Nama</p>
                        <p className="font-medium text-slate-900">{selectedActivity.target.nama}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Username</p>
                        <p className="text-sm text-slate-900">@{selectedActivity.target.username}</p>
                      </div>
                      {selectedActivity.target.email && (
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-sm text-slate-900">{selectedActivity.target.email}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500">Role</p>
                        <p className="text-sm text-slate-900">
                          {selectedActivity.target.role === 'PETUGAS' ? 'Petugas' : 'Peminjam'}
                        </p>
                      </div>
                      {selectedActivity.target.is_active !== undefined && (
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="text-sm text-slate-900">
                            {selectedActivity.target.is_active ? 'Aktif' : 'Tidak Aktif'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    rounded="xl"
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedActivity(null)
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
