<script setup>
import { ref, computed } from "vue";
import { useSalesReportStore } from "../../application/salesReport.store.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const store = useSalesReportStore();
const fromDate = ref("");
const toDate = ref("");

// Format money
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `S/. ${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

//Computed data
const reportData = computed(() => store.reports || {});
const saleItems = computed(() => store.saleItems || []);
const paymentSummary = computed(() => store.paymentSummary || []);

//Nuevo: calcular total global de métodos de pago
const totalAmountAllMethods = computed(() =>
    paymentSummary.value.reduce(
        (sum, method) => sum + (Number(method.total) || 0),
        0
    )
);

//EXPORT TO EXCEL
const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  //Overview
  const overview = [
    ["Metric", "Value"],
    ["Total Revenue", formatCurrency(reportData.value.totalRevenue || 0)],
    ["Total Profit", formatCurrency(reportData.value.totalProfit || 0)],
    ["Total Sales", formatCurrency(reportData.value.totalSales || 0)],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overview), "Overview");

  //Payment Methods
  const paymentSheet = [["Payment Method", "Transactions", "Total Amount"]];
  paymentSummary.value.forEach((p) => {
    paymentSheet.push([p.method, p.transactions, formatCurrency(p.total)]);
  });


  paymentSheet.push(["TOTAL", "", formatCurrency(totalAmountAllMethods.value)]);

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(paymentSheet), "Payment Methods");

  //Transactions
  const transactionsSheet = [["ID", "Date", "Time", "Sale Type", "Payment Method", "Total", "Waiter"]];
  store.reports.forEach((s) => {
    transactionsSheet.push([
      s.id,
      s.creationDate,
      s.creationTime,
      s.saleType,
      s.paymentMethod,
      formatCurrency(s.total),
      s.waiter,
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(transactionsSheet), "Transactions");

  //Dishes
  const dishesSheet = [["Dish", "Item ID", "Category", "Quantity", "Profit", "Sales (%)"]];
  saleItems.value.forEach((d) => {
    dishesSheet.push([
      d.name,
      d.id,
      d.category || "N/A",
      d.quantity,
      formatCurrency(d.subtotal),
      ((d.quantity / 100) * 100).toFixed(1) + "%",
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dishesSheet), "Best Selling Dishes");

  //Save file
  XLSX.writeFile(wb, "Sales_Report.xlsx");
};

//EXPORT TO PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(18);
  doc.text("Sales Report", 14, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y);
  y += 10;

  //General Overview
  doc.text("General Overview", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrency(reportData.value.totalRevenue || 0)],
      ["Total Profit", formatCurrency(reportData.value.totalProfit || 0)],
      ["Total Sales", formatCurrency(reportData.value.totalSales || 0)],
    ],
  });
  y = doc.lastAutoTable.finalY + 10;

  //Payment Methods
  doc.text("Popular Payment Methods", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Payment Method", "Transactions", "Total Amount"]],
    body: [
      ...paymentSummary.value.map((p) => [
        p.method,
        p.transactions,
        formatCurrency(p.total),
      ]),
      //Fila total al final
      ["TOTAL", "", formatCurrency(totalAmountAllMethods.value)],
    ],
  });
  y = doc.lastAutoTable.finalY + 10;

  //Transactions
  doc.text("All Payment Transactions", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Time", "Sale Type", "Payment Method", "Total", "Waiter"]],
    body: store.reports.map((s) => [
      s.id,
      s.creationDate,
      s.creationTime,
      s.saleType,
      s.paymentMethod,
      formatCurrency(s.total),
      s.waiter,
    ]),
    styles: { fontSize: 8 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Dishes
  doc.text("Best Selling Dishes", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Dish", "Item ID", "Category", "Quantity", "Profit", "Sales (%)"]],
    body: saleItems.value.map((d) => [
      d.name,
      d.id,
      d.category || "N/A",
      d.quantity,
      formatCurrency(d.subtotal),
      d.salesPercent + "%",
    ]),
    styles: { fontSize: 8 },
  });

  doc.save("Sales_Report.pdf");
};
</script>

<template>
  <section class="card export">
    <h2>Export Information</h2>
    <div class="export-grid">
      <button class="excel" @click="exportToExcel">Export to Excel</button>
      <button class="pdf" @click="exportToPDF">Export to PDF</button>
    </div>
  </section>
</template>

<style scoped>
button.excel {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
}
button.pdf {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
}
</style>
