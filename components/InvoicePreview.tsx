"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { SaleApi } from "@/lib/api/apis";

interface InvoicePreviewProps {
  saleId: string; // sirf id milegi
  onClose: () => void;
}

export default function InvoicePreview({ saleId, onClose }: InvoicePreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // 🔹 Data fetch from API
  const fetchData = async (id: string) => {
    const res = await fetch(SaleApi.Invoice(id));
    if (!res.ok) throw new Error("Failed to fetch invoice");
    return res.json();
  };

  useEffect(() => {
    if (!saleId) return;

    const generatePDF = async () => {
      const invoice = await fetchData(saleId);

      // Dynamic height depending on items
      const pageHeight = 80 + invoice.items.length * 8;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, pageHeight], // 👈 Receipt size (80mm width)
      });

      // --- Header ---
      doc.setFontSize(12);
      doc.text("Sales Invoice", 40, 10, { align: "center" });
      doc.setFontSize(9);
      doc.text(`Invoice #: ${invoice.Invoice}`, 5, 18);
      doc.text(`Customer: ${invoice.customer || "Walk-in"}`, 5, 23);
      doc.text(`Date: ${new Date(invoice.date).toLocaleString()}`, 5, 28);

      // --- Table Header ---
      let y = 38;
      doc.setFontSize(9);
      doc.text("Product", 5, y);
      doc.text("Qty", 35, y);
      doc.text("Price", 48, y);
      doc.text("Total", 68, y, { align: "right" });

      y += 4;
      doc.line(5, y, 75, y);

      // --- Items ---
      invoice.items.forEach((item: any) => {
        const lineTotal = item.quantity * item.price;
        y += 6;
        doc.text(item.product.name, 5, y); // ✅ product.name from API
        doc.text(item.quantity.toString(), 40, y, { align: "right" });
        doc.text(item.price.toFixed(2), 55, y, { align: "right" });
        doc.text(lineTotal.toFixed(2), 72, y, { align: "right" });
      });

      y += 4;
      doc.line(5, y, 75, y);
      y += 8;

      // --- Totals ---
      doc.setFontSize(10);
      doc.text("Grand Total: ", 40, y);
      doc.text(invoice.total.toFixed(2), 72, y, { align: "right" });

      y += 6;
      doc.text("Paid:", 40, y);
      doc.text(invoice.PayAmmount.toFixed(2), 72, y, { align: "right" });

      y += 6;
      doc.text("Balance:", 40, y);
      doc.text((invoice.total - invoice.PayAmmount).toFixed(2), 72, y, { align: "right" });

      // --- Footer ---
      y += 15;
      doc.setFontSize(8);
      doc.text("Thank you for your purchase!", 40, y, { align: "center" });

      // Convert to URL for preview
      const url = doc.output("datauristring");
      setPdfUrl(url);
    };

    generatePDF();
  }, [saleId]);

  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[300px] h-[90%] flex flex-col">
        <iframe src={pdfUrl} className="flex-1 w-full" title="Invoice Preview" />
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
