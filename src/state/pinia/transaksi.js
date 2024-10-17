import axios from "axios";
import { defineStore } from "pinia";

export const useTransaksiStore = defineStore("transaksi", {
  state: () => ({
    // apiUrl: "http://127.0.0.1:8000",
    apiUrl: process.env.VUE_APP_APIURL,
    customers: [],
    products: [],
    response: {
      status: null,
      message: null,
      error: [],
    },
    totalData: 0,
    current: 1,
    perpage: 10,
    searchQuery: "",
  }),
  actions: {
    // Fetch customers
    async getCustomers() {
      try {
        const url = `${this.apiUrl}/api/v1/customers`;
        const res = await axios.get(url);
        this.customers = res.data.data.list;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    // Fetch products with search functionality
    async getProducts() {
      try {
        const url = `${this.apiUrl}/api/v1/products?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
        const res = await axios.get(url);

        // Mapping photo_url to imageUrl
        this.products = res.data.data.list.map((product) => ({
          ...product,
          imageUrl: product.photo_url, // Mapping image URL
        }));

        this.totalData = res.data.data.meta.total;
      } catch (error) {
        console.error("Error fetching products:", error.message);
        this.response = {
          status: error.response?.status || 500,
          message: "Failed to fetch products",
          error: error.response?.data?.errors || [],
        };
      }
    },

    // Update search query
    updateSearchQuery(query) {
      this.searchQuery = query;
      this.getProducts(); // Fetch products based on the search query
    },

    // Create Transaction and Add Details
    async addTransaction(customerId, orderItems) {
      try {
        // Step 1: Create the transaction
        const transactionRes = await axios.post(`${this.apiUrl}/api/v1/sales`, {
          m_customer_id: customerId,
        });
        const transactionId = transactionRes.data.data.id;

        // Step 2: Loop through orderItems and send them one by one
        for (let item of orderItems) {
          const salesDetail = {
            t_sales_id: transactionId,
            m_product_detail_id: 2, // Adjust this as needed
            m_product_id: item.id,
            total_item: item.quantity,
            price: item.price,
          };

          await axios.post(
            `${this.apiUrl}/api/v1/sales-detail`,
            salesDetail, // Send each object individually
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        this.response = {
          status: 200,
          message: "Transaction and details successfully created.",
        };

        return true;
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: "Failed to create transaction.",
          error: error.response?.data?.errors || [],
        };
        return false;
      }
    },
  },
});
