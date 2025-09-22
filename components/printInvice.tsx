"use client"

import { useEffect } from "react"
import { jsPDF } from "jspdf"

interface SaleViewProps {
  open: boolean
  sales: any
  close: () => void
}

export function PrintDialog({ open, sales, close }: SaleViewProps) {
  useEffect(() => {
    if (open && sales) {
      const doc = new jsPDF("p", "mm", "a5") // A5 page size

      // --- Page Border ---
      doc.setLineWidth(0.5)
      doc.rect(5, 5, 138, 200) // x, y, width, height (A5 ~148x210mm)

      // --- Header ---
      doc.setFontSize(16)
      doc.text("🛍️ My Shop Name", 74, 15, { align: "center" })

      doc.setFontSize(10)
      doc.text(`Invoice No: ${sales.Invoice}`, 10, 30)
      doc.text(`Customer: ${sales.customer}`, 10, 36)
      doc.text(`Date: ${new Date(sales.date).toLocaleString()}`, 10, 42)

      // --- Table Header ---
      const startY = 55
      doc.setFontSize(11)
      doc.setLineWidth(0.2)

      // Draw header row box
      doc.rect(10, startY, 128, 8)
      doc.text("Product", 12, startY + 6)
      doc.text("Qty", 80, startY + 6)
      doc.text("Price", 100, startY + 6)
      doc.text("Total", 120, startY + 6)

      // --- Table Rows ---
      let y = startY + 8
      sales.items.forEach((item: any) => {
        doc.rect(10, y, 128, 8) // row border
        doc.text(item.product?.name || item.product, 12, y + 6)
        doc.text(item.quantity.toString(), 80, y + 6)
        doc.text(`$${item.price.toFixed(2)}`, 100, y + 6)
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 120, y + 6)
        y += 8
      })

      // --- Grand Total ---
      doc.setFontSize(12)
      doc.text(`Grand Total: $${sales.total.toFixed(2)}`, 120, y + 10, { align: "right" })

      // --- Footer ---
      doc.setFontSize(10)
      doc.text("⭐ Thank you for shopping with us! ⭐", 74, 195, { align: "center" })

      // Print Dialog
      doc.autoPrint()
      window.open(doc.output("bloburl"), "_blank")

      close()
    }
  }, [open, sales, close])

  return null
}
