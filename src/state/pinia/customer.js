import axios from "axios";
import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    apiUrl: process.env.VUE_APP_APIURL,
    customers: [],
    customer: null,
    response: {
      status: null,
      message: null,
      error: [],
    },
    modalAction: {
      action: "",
      modal_title: "",
      modal_button: "",
    },
    totalData: 0,
    current: 1,
    perpage: 5,
    searchQuery: "",
  }),
  actions: {
    openForm(newAction, customer) {
      this.modalAction.action = newAction;
      this.customer = customer;
    },
    async getCustomers() {
      try {
        //
        const url = `http://127.0.0.1:8000/api/v1/customers?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
        const res = await axios.get(url);
        const customersDataList = res.data.data.list;
        this.customers = customersDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },
    async changePage(newPage) {
      this.current = newPage;
      await this.getCustomers();
    },
    async searchUsers(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getCustomers();
    },
    async addCustomer(customer) {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/v1/customer",
          customer,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      } finally {
        this.getCustomers();
      }
    },
    async deleteUser(id) {
      this.loading = true;
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/customer/${id}`);
        this.response = {
          status: "200",
        };
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      } finally {
        this.getCustomers();
      }
    },
    async updateCustomer(customer) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/customer`, customer, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        this.response = {
          status: "200",
        };
      } catch (error) {
        this.response = {
          status: error.status,
          message: error.message,
        };
      }
    },
    resetState() {
      this.customers = [];
      this.customer = null;
      this.response = {
        status: null,
        message: null,
        error: [],
      };
      this.modalAction = {
        action: "",
        modal_title: "",
        modal_button: "",
      };
      this.totalData = 0;
      this.current = 1;
      this.searchQuery = "";
    },
  },
});
