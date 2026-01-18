/**
 * useLaporan Hook (for Petugas)
 * Custom hook untuk mengelola logic laporan (fetching, filtering, export)
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as loanService from '@/Service/loanService'
import * as returnService from '@/Service/returnService'

export function useLaporan() {
  const toast = useToast()
  const [loans, setLoans] = useState([])
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('PINJAMAN') // PINJAMAN or PENGEMBALIAN
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredData, setFilteredData] = useState([])

  // Initialize default dates
  useEffect(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    setEndDate(today.toISOString().split('T')[0])
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
  }, [])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans, returns, reportType, startDate, endDate])

  /**
   * Fetch all loans and returns data
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [loansData, returnsData] = await Promise.all([
        loanService.getLoans().catch(() => []),
        returnService.getReturns().catch(() => []),
      ])
      setLoans(loansData)
      setReturns(returnsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error', 'Gagal memuat data laporan')
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Apply filters based on report type and date range
   */
  const applyFilters = useCallback(() => {
    if (!startDate || !endDate) {
      setFilteredData([])
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    if (reportType === 'PINJAMAN') {
      // Filter loans based on tanggal_pinjam
      const filtered = loans.filter((loan) => {
        const loanDate = new Date(loan.tanggal_pinjam)
        return loanDate >= start && loanDate <= end
      })
      setFilteredData(filtered)
    } else {
      // Filter returns based on tanggal_kembali
      const filtered = returns.filter((returnItem) => {
        const returnDate = new Date(returnItem.tanggal_kembali || returnItem.created_at)
        return returnDate >= start && returnDate <= end
      })
      setFilteredData(filtered)
    }
  }, [loans, returns, reportType, startDate, endDate])

  /**
   * Format date to long format
   */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  /**
   * Format date to short format
   */
  const formatDateShort = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [])

  /**
   * Format date to datetime format
   */
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  /**
   * Export filtered data to PDF
   */
  const exportToPDF = useCallback(async () => {
    try {
      // Dynamic import untuk jspdf
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF('landscape', 'mm', 'a4')

      // Header
      doc.setFontSize(18)
      doc.text(
        reportType === 'PINJAMAN' ? 'Laporan Peminjaman Alat' : 'Laporan Pengembalian Alat',
        14,
        15
      )

      doc.setFontSize(11)
      doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 22)
      doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        14,
        27
      )

      // Prepare table data
      const tableData = filteredData.map((item, index) => {
        if (reportType === 'PINJAMAN') {
          return [
            index + 1,
            formatDateShort(item.tanggal_pinjam),
            item.user?.nama || '-',
            item.equipment?.nama || '-',
            `${item.jumlah} unit`,
            formatDateShort(item.tanggal_deadline),
            item.status === 'BORROWED'
              ? 'Dipinjam'
              : item.status === 'RETURNED'
              ? 'Dikembalikan'
              : item.status,
          ]
        } else {
          return [
            index + 1,
            formatDateShort(item.tanggal_kembali || item.created_at),
            item.loan?.user?.nama || '-',
            item.loan?.equipment?.nama || '-',
            `${item.loan?.jumlah || 0} unit`,
            item.catatan || '-',
          ]
        }
      })

      const headers =
        reportType === 'PINJAMAN'
          ? ['No', 'Tanggal Pinjam', 'Peminjam', 'Alat', 'Jumlah', 'Deadline', 'Status']
          : ['No', 'Tanggal Kembali', 'Peminjam', 'Alat', 'Jumlah', 'Catatan']

      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 32,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [71, 85, 105] },
      })

      // Footer
      doc.setFontSize(10)
      doc.text(
        `Total: ${filteredData.length} ${reportType === 'PINJAMAN' ? 'peminjaman' : 'pengembalian'}`,
        14,
        doc.internal.pageSize.height - 10
      )

      // Save PDF
      const filename = `${reportType === 'PINJAMAN' ? 'Laporan_Peminjaman' : 'Laporan_Pengembalian'}_${startDate}_${endDate}.pdf`
      doc.save(filename)

      toast.success('Berhasil', 'Laporan PDF berhasil diunduh')
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      toast.error('Error', 'Gagal mengekspor PDF. Pastikan library jspdf terinstall.')
    }
  }, [filteredData, reportType, startDate, endDate, formatDate, formatDateShort, toast])

  /**
   * Export filtered data to Excel
   */
  const exportToExcel = useCallback(async () => {
    try {
      // Dynamic import untuk xlsx
      const XLSX = await import('xlsx')

      // Prepare data
      const excelData = filteredData.map((item, index) => {
        if (reportType === 'PINJAMAN') {
          return {
            No: index + 1,
            'Tanggal Pinjam': formatDateShort(item.tanggal_pinjam),
            Peminjam: item.user?.nama || '-',
            Username: item.user?.username || '-',
            Alat: item.equipment?.nama || '-',
            Kategori: item.equipment?.kategori?.nama || '-',
            Jumlah: `${item.jumlah} unit`,
            Deadline: formatDateShort(item.tanggal_deadline),
            Status:
              item.status === 'BORROWED'
                ? 'Dipinjam'
                : item.status === 'RETURNED'
                ? 'Dikembalikan'
                : item.status,
          }
        } else {
          return {
            No: index + 1,
            'Tanggal Kembali': formatDateShort(item.tanggal_kembali || item.created_at),
            Peminjam: item.loan?.user?.nama || '-',
            Username: item.loan?.user?.username || '-',
            Alat: item.loan?.equipment?.nama || '-',
            Kategori: item.loan?.equipment?.kategori?.nama || '-',
            Jumlah: `${item.loan?.jumlah || 0} unit`,
            Catatan: item.catatan || '-',
          }
        }
      })

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      const colWidths =
        reportType === 'PINJAMAN'
          ? [
              { wch: 5 }, // No
              { wch: 15 }, // Tanggal Pinjam
              { wch: 20 }, // Peminjam
              { wch: 15 }, // Username
              { wch: 25 }, // Alat
              { wch: 15 }, // Kategori
              { wch: 10 }, // Jumlah
              { wch: 15 }, // Deadline
              { wch: 12 }, // Status
            ]
          : [
              { wch: 5 }, // No
              { wch: 15 }, // Tanggal Kembali
              { wch: 20 }, // Peminjam
              { wch: 15 }, // Username
              { wch: 25 }, // Alat
              { wch: 15 }, // Kategori
              { wch: 10 }, // Jumlah
              { wch: 30 }, // Catatan
            ]
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan')

      // Save file
      const filename = `${reportType === 'PINJAMAN' ? 'Laporan_Peminjaman' : 'Laporan_Pengembalian'}_${startDate}_${endDate}.xlsx`
      XLSX.writeFile(wb, filename)

      toast.success('Berhasil', 'Laporan Excel berhasil diunduh')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Error', 'Gagal mengekspor Excel. Pastikan library xlsx terinstall.')
    }
  }, [filteredData, reportType, startDate, endDate, formatDateShort, toast])

  /**
   * Calculate stats from filtered data
   */
  const stats = {
    total: filteredData.length,
    borrowed:
      reportType === 'PINJAMAN' ? filteredData.filter((l) => l.status === 'BORROWED').length : 0,
    returned:
      reportType === 'PINJAMAN'
        ? filteredData.filter((l) => l.status === 'RETURNED').length
        : filteredData.length,
  }

  return {
    // Data
    filteredData,
    loans,
    returns,
    loading,

    // Filters
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,

    // Functions
    fetchData,
    exportToPDF,
    exportToExcel,

    // Formatters
    formatDate,
    formatDateShort,
    formatDateTime,

    // Stats
    stats,
  }
}

