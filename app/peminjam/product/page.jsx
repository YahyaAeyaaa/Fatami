'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Search, Filter, X, ArrowRight, Loader2 } from 'lucide-react'
import * as equipmentService from '@/Service/equipmentService'

export default function ProductPage() {
  const router = useRouter()
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchEquipments()
  }, [])

  const fetchEquipments = async () => {
    try {
      setLoading(true)
      const data = await equipmentService.getEquipments()
      // Filter hanya yang ada stoknya
      setEquipments(data.filter((eq) => eq.stok > 0))
    } catch (error) {
      console.error('Failed to fetch equipments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from equipments
  const categories = [
    'Semua',
    ...new Set(equipments.map((eq) => eq.kategori?.nama).filter(Boolean)),
  ]

  // Filter equipments
  const filteredProducts = equipments.filter((product) => {
    const matchesSearch =
      product.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.kode_alat?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Semua' || product.kategori?.nama === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockBadgeColor = (stok) => {
    if (stok > 10) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (stok > 5) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (stok > 0) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Memuat data alat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Katalog Alat</h1>
            <p className="text-slate-500 mt-1">Jelajahi alat-alat yang tersedia untuk dipinjam</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 appearance-none cursor-pointer min-w-[180px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <p>
            Menampilkan <span className="font-semibold text-slate-900">{filteredProducts.length}</span> alat
            {searchQuery && (
              <span>
                {' '}
                untuk "<span className="font-medium">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product)
                  setShowDetailModal(true)
                }}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStockBadgeColor(product.stok)}`}
                    >
                      Stok: {product.stok}
                    </span>
                  </div>
                  {/* Category Badge */}
                  {product.kategori?.nama && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200">
                        {product.kategori.nama}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.nama}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 min-h-[4rem]">
                    {product.deskripsi || 'Tidak ada deskripsi'}
                  </p>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {product.stok} tersedia
                      </span>
                    </div>
                    {product.stok < 5 && (
                      <span className="text-xs text-amber-600 font-medium">Stok terbatas</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Alat tidak ditemukan</h3>
            <p className="text-slate-500 max-w-md">
              {searchQuery
                ? 'Coba gunakan kata kunci lain atau hapus filter pencarian'
                : 'Tidak ada alat yang tersedia saat ini'}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">Detail Alat</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedProduct(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <div className="relative w-full h-80 bg-slate-100 rounded-2xl overflow-hidden">
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-24 h-24 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStockBadgeColor(selectedProduct.stok)}`}
                      >
                        Stok: {selectedProduct.stok}
                      </span>
                      {selectedProduct.kategori?.nama && (
                        <span className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {selectedProduct.kategori.nama}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3">{selectedProduct.nama}</h3>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedProduct.deskripsi || 'Tidak ada deskripsi'}
                      </p>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Stok Tersedia</p>
                          <p className="text-lg font-semibold text-slate-900">{selectedProduct.stok} unit</p>
                        </div>
                      </div>
                      {selectedProduct.kategori?.nama && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-slate-400">📦</div>
                          <div>
                            <p className="text-sm text-slate-500">Kategori</p>
                            <p className="text-lg font-semibold text-slate-900">
                              {selectedProduct.kategori.nama}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedProduct.kode_alat && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-slate-400">🔖</div>
                          <div>
                            <p className="text-sm text-slate-500">Kode Alat</p>
                            <p className="text-lg font-semibold text-slate-900">
                              {selectedProduct.kode_alat}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-200">
                      <Link
                        href={`/peminjam/pinjaman/ajukan?equipmentId=${selectedProduct.id}`}
                        onClick={() => setShowDetailModal(false)}
                        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
                      >
                        <span>Ajukan Peminjaman</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
