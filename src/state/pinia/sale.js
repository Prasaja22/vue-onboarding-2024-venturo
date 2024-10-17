import {
    defineStore
} from "pinia";
import axios from "axios";

export const useSaleStore = defineStore('sale', {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        products: [],
        productById: '',
        response: {
            status: null,
            message: null,
            list: []
        },
        formAction: {
            'action': "",
            'form_title': "",
            'form_button': ""
        },
        totalData: 0,
        current: 1,
        perpage: 25,
        searchQuery: '',
        maxImageSize: 3 * 1024 * 1024
    }),
    actions: {
        openForm(newAction) {
            this.formAction.action = newAction
        },
        async addSale(sale) {
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/sale`, sale)
                this.response = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                this.response = {
                    status: error.response.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            }
        },
    },
    getters: {

    }
})