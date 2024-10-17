import { defineStore } from "pinia";
import axios from 'axios';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        categories: [],
        category: null,
        error: {
            status: null,
            message: null,
            list: []
        },
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        },
        totalData: 0,
        current: 1,
        perpage: 5,
        searchQuery: '',
    }),
    actions: {
        openForm(newAction, category) {
            this.modalAction.action = newAction
            this.category = category
        },
        async getCategories() {
            try {
                const url =
                    `${this.apiUrl}/api/v1/categories?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const categoriesDataList = res.data.data.list
                this.categories = categoriesDataList
                this.totalData = res.data.data.meta.total
            } catch (error) {
                this.error = {
                    status: error.response ?.status,
                    message: error.message,
                };
            }
        },
        async changePage(newPage) {
            this.current = newPage;
            await this.getCategories();
        },
        async searchCategories(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getCategories();
        },
        async addCategories(categories) {
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/categories`, categories, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                this.error = {
                    status: error.response ?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                this.getCategories();
            }
        },
        async deleteCategory(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/categories/${id}`);
                this.error = {
                    status: '200',
                };
            } catch (error) {
                this.error = {
                    status: error.response ?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                this.getCategories();
            }
        },
        async updateCategory(categories) {
            try {
                await axios.put(`${this.apiUrl}/api/v1/categories/`, categories, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                this.error = {
                    status: '200',
                };
            } catch (error) {
                this.error = {
                    status: error.status,
                    message: error.message,
                };
            }
        }
    },
})