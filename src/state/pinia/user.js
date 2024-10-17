import { defineStore } from "pinia";
import axios from "axios";
export const useUserStore = defineStore("user", {
  state: () => ({
    apiUrl: process.env.VUE_APP_APIURL,
    users: [],
    user: null,
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
    openForm(newAction, user) {
      this.modalAction.action = newAction;
      this.user = user;
    },
    async getUsers() {
      try {
        //
        const url = `http://127.0.0.1:8000/api/v1/users?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
        const res = await axios.get(url);
        const usersDataList = res.data.data.list;
        this.users = usersDataList;
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
      await this.getUsers();
    },
    async searchUsers(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getUsers();
    },
    async addUsers(users) {
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/v1/user`,
          users,
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
        this.getUsers();
      }
    },
    async deleteUser(id) {
      this.loading = true;
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/user/${id}`);
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
        this.getUsers();
      }
    },
    async updateUser(users) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/user`, users, {
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
      this.users = [];
      this.user = null;
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
