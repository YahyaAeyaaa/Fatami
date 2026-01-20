// Helper untuk generate PDF pengajuan pengembalian & bukti approval pengembalian

export async function generateReturnPdf(returnItem, options = {}) {
  if (!returnItem) return

  const { type = 'REQUEST' } = options // 'REQUEST' | 'APPROVAL'

  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF('portrait', 'mm', 'a4')

  const lineHeight = 7
  let y = 20

  const addText = (text, x, align = 'left', fontSize = 12, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setFontSize(fontSize)
    if (align === 'center') {
      doc.text(text, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' })
    } else {
      doc.text(text, x, y)
    }
    y += lineHeight
  }

  const now = new Date()
  const loan = returnItem.loan

  const isApproval = type === 'APPROVAL'
  addText(
    isApproval ? 'BUKTI APPROVAL PENGEMBALIAN ALAT' : 'PENGAJUAN PENGEMBALIAN ALAT',
    0,
    'center',
    16,
    true
  )
  y += 2
  addText('Sistem Peminjaman Alat', 0, 'center', 11)
  y += 4

  addText(
    `Dicetak pada: ${now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    20,
    'left',
    10
  )
  y += lineHeight

  addText('Data Pengembalian', 20, 'left', 12, true)
  addText(`ID Pengembalian : ${returnItem.id}`, 25, 'left', 10)
  addText(`ID Peminjaman   : ${loan?.id || '-'}`, 25, 'left', 10)
  addText(`Peminjam        : ${loan?.user?.nama || '-'}`, 25, 'left', 10)
  addText(`Email           : ${loan?.user?.email || '-'}`, 25, 'left', 10)

  if (isApproval) {
    addText(`Disetujui Oleh  : ${returnItem.approver?.nama || '-'}`, 25, 'left', 10)
    if (returnItem.tanggal_kembali) {
      const tgl = new Date(returnItem.tanggal_kembali)
      addText(
        `Tanggal Disetujui: ${tgl.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        25,
        'left',
        10
      )
    }
  } else {
    addText(`Status          : Menunggu Approval Petugas`, 25, 'left', 10)
  }

  if (loan?.tanggal_pinjam) {
    const t = new Date(loan.tanggal_pinjam)
    addText(
      `Tanggal Pinjam  : ${t.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      25,
      'left',
      10
    )
  }

  if (loan?.tanggal_deadline) {
    const d = new Date(loan.tanggal_deadline)
    addText(
      `Deadline Kembali: ${d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      25,
      'left',
      10
    )
  }

  y += lineHeight
  addText('Detail Alat', 20, 'left', 12, true)
  addText(`Nama Alat : ${loan?.equipment?.nama || '-'}`, 25, 'left', 10)
  addText(`Kategori  : ${loan?.equipment?.kategori?.nama || '-'}`, 25, 'left', 10)
  addText(`Jumlah    : ${loan?.jumlah || 0} unit`, 25, 'left', 10)

  y += lineHeight
  addText('Keterangan', 20, 'left', 12, true)
  if (isApproval) {
    addText('Pengembalian telah disetujui oleh petugas.', 25, 'left', 10)
    addText('Barang dinyatakan kembali dan stok telah diperbarui.', 25, 'left', 10)
  } else {
    addText('Pengajuan pengembalian telah dibuat oleh peminjam.', 25, 'left', 10)
    addText('Menunggu verifikasi/approval dari petugas.', 25, 'left', 10)
  }

  y += lineHeight * 2
  const pageWidth = doc.internal.pageSize.getWidth()
  const leftX = 25
  const rightX = pageWidth - 25
  const footerYStart = y

  doc.setFontSize(11)
  doc.text('Peminjam,', leftX, footerYStart)
  doc.text('Petugas,', rightX, footerYStart, { align: 'right' })

  const footerYName = footerYStart + lineHeight * 3
  doc.setFont('helvetica', 'bold')
  doc.text(loan?.user?.nama || '-', leftX, footerYName)
  doc.text((isApproval ? returnItem.approver?.nama : '-') || '-', rightX, footerYName, {
    align: 'right',
  })

  const safeNama = (loan?.user?.nama || 'peminjam')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
  const prefix = isApproval ? 'bukti_approval_pengembalian' : 'pengajuan_pengembalian'
  const fileName = `${prefix}_${safeNama}_${(loan?.id || returnItem.id).substring(0, 8)}.pdf`

  doc.save(fileName)
}


