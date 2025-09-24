const baseUrl = "http://localhost:3010/api";


export const dashboardApi = {
  getProfit: `${baseUrl}/dashboard/profit`,
  getRecentCustomer: `${baseUrl}/dashboard/recent-sales`,
  getMonthlySale:`${baseUrl}/dashboard/monthly-sales`
};

export const ReportsApi = {
  getProfit: `${baseUrl}/reports/profit`,
   getMonthlySale:`${baseUrl}/reports/monthly-sales-eport`,
    countmonthlyorder:`${baseUrl}/reports/monthly-orders-customers`,
     weaklyReport:`${baseUrl}/reports/weekly`,
      byProductReport:`${baseUrl}/reports/products`,
      categorybyReport:`${baseUrl}/reports/by-category`,
        InventoryReport:`${baseUrl}/reports/report`,

};



export const productApi = {
  addProduct: `${baseUrl}/products`,
  getProducts: `${baseUrl}/products`,
  updateProduct: (id: string) => `${baseUrl}/products/${id}`,
  deleteProduct: (id: string) => `${baseUrl}/products/${id}`,

  getProductById: (id: string) => `${baseUrl}/products/${id}`,
  
  fileUrl: (path: string) => `${baseUrl}/uploads/${path}`,
};



export const purchaseApi = {
  addOrder: `${baseUrl}/Purchases`,
  getOrders: `${baseUrl}/purchases`,
  getOrderById: (id: string) => `${baseUrl}/purchases/${id}`,
  updateOrder: (id: string) => `${baseUrl}/purchases/${id}`,
  deleteOrder: (id: string) => `${baseUrl}/purchases/${id}`,
};


export const SaleApi = {
  ProcessPayment: `${baseUrl}/sales`,
  SaleHistory: `${baseUrl}/sales`,
  update: (id: string) => `${baseUrl}/sales/${id}`,
  Invoice: (id: string) => `${baseUrl}/sales/${id}`,
  RefundSale: (id: string) => `${baseUrl}/sales/${id}/refund`,
  getSaleById: (id: string) => `${baseUrl}/sales/${id}`,
  todaystats: `${baseUrl}/sales/today-stats`,
};

export const UserApi = {
  addUser: `${baseUrl}/users`,
  getUsers: `${baseUrl}/users`,
  updateUser: (id: string) => `${baseUrl}/users/${id}`,
  deleteUser: (id: string) => `${baseUrl}/users/${id}`,
};


export const SupplierApi = {
  addSupplier: `${baseUrl}/suppliers`,
  getSuppliers: `${baseUrl}/suppliers`,
  updateSupplier: (id: string) => `${baseUrl}/suppliers/${id}`,
 HanCash: (id: string) => `${baseUrl}/suppliers/${id}/transactions`,
  deleteSupplier: (id: string) => `${baseUrl}/suppliers/${id}`,
};



export const CustomerApi = {
  addCustomer: `${baseUrl}/customer`,
  getCustomer: `${baseUrl}/customer`,
   UpdateCustomer: (id: string) => `${baseUrl}/customer/${id}`,
    HanCash: (id: string) => `${baseUrl}/customer/${id}/add-transaction`,
};
