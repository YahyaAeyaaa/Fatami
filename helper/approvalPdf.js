// Helper untuk generate PDF bukti approval peminjaman

export async function generateApprovalPdf(loan, options = {}) {
  if (!loan) return

  const {
    printedByRole = 'PEMINJAM', // 'PEMINJAM' atau 'PETUGAS'
    type = 'APPROVAL', // 'APPROVAL' atau 'BORROWED_RECEIPT'
  } = options

  // Dynamic import jsPDF untuk menghindari masalah SSR
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

  // Header
  const isBorrowedReceipt = type === 'BORROWED_RECEIPT'
  addText(
    isBorrowedReceipt ? 'BUKTI PEMINJAMAN ALAT' : 'BUKTI APPROVAL PEMINJAMAN ALAT',
    0,
    'center',
    16,
    true
  )
  y += 2
  addText('Sistem Peminjaman Alat', 0, 'center', 11)
  y += 4

  const now = new Date()
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

  // Info umum
  addText('Data Peminjaman', 20, 'left', 12, true)
  addText(`ID Peminjaman : ${loan.id}`, 25, 'left', 10)
  addText(`Peminjam      : ${loan.user?.nama || '-'}`, 25, 'left', 10)
  addText(`Email         : ${loan.user?.email || '-'}`, 25, 'left', 10)
  addText(`Disetujui Oleh: ${loan.approver?.nama || '-'}`, 25, 'left', 10)

  const tanggalPinjam = loan.tanggal_pinjam
    ? new Date(loan.tanggal_pinjam)
    : null
  const deadline = loan.tanggal_deadline ? new Date(loan.tanggal_deadline) : null
  const approvedAt = loan.approved_at ? new Date(loan.approved_at) : null

  // Untuk APPROVAL: tampilkan tanggal pengajuan & disetujui.
  // Untuk BORROWED_RECEIPT: tampilkan tanggal dipinjam & deadline.
  if (!isBorrowedReceipt && tanggalPinjam) {
    addText(
      `Tanggal Pengajuan : ${tanggalPinjam.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      25,
      'left',
      10
    )
  }

  if (!isBorrowedReceipt && approvedAt) {
    addText(
      `Tanggal Disetujui : ${approvedAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      25,
      'left',
      10
    )
  }

  if (isBorrowedReceipt && tanggalPinjam) {
    addText(
      `Tanggal Peminjaman : ${tanggalPinjam.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      25,
      'left',
      10
    )
  }

  if (deadline) {
    addText(
      `Tanggal Pengembalian (Deadline) : ${deadline.toLocaleDateString('id-ID', {
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
  addText(`Nama Alat : ${loan.equipment?.nama || '-'}`, 25, 'left', 10)
  addText(`Kategori  : ${loan.equipment?.kategori?.nama || '-'}`, 25, 'left', 10)
  addText(`Jumlah    : ${loan.jumlah || 0} unit`, 25, 'left', 10)

  y += lineHeight
  addText('Keterangan', 20, 'left', 12, true)
  if (isBorrowedReceipt) {
    addText(
      'Alat telah dipinjam oleh peminjam sesuai data di atas.',
      25,
      'left',
      10
    )
    addText(
      'Peminjam bertanggung jawab mengembalikan alat sebelum atau pada tanggal deadline.',
      25,
      'left',
      10
    )
  } else {
    addText(
      'Peminjam telah mendapatkan persetujuan untuk meminjam alat tersebut.',
      25,
      'left',
      10
    )
    addText(
      'Harap membawa lembar bukti approval ini saat mengambil alat di ruang petugas.',
      25,
      'left',
      10
    )
  }

  y += lineHeight * 2

  // Area tanda tangan
  const pageWidth = doc.internal.pageSize.getWidth()
  const leftX = 25
  const rightX = pageWidth - 25

  const footerYStart = y

  doc.setFontSize(11)
  doc.text('Peminjam,', leftX, footerYStart)
  doc.text('Petugas,', rightX, footerYStart, { align: 'right' })

  const footerYName = footerYStart + lineHeight * 3
  doc.setFont('helvetica', 'bold')
  doc.text(loan.user?.nama || '-', leftX, footerYName)
  doc.text(loan.approver?.nama || '-', rightX, footerYName, { align: 'right' })

  // Nama file
  const safeNama = (loan.user?.nama || 'peminjam')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
  const filePrefix = isBorrowedReceipt ? 'bukti_peminjaman' : 'bukti_approval'
  const fileName = `${filePrefix}_${safeNama}_${loan.id.substring(0, 8)}.pdf`

  doc.save(fileName)
}


