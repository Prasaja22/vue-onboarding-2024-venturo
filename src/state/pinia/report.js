import { defineStore } from "pinia";
import axios from "axios";

export const useReportStore = defineStore("reportStore", {
  state: () => ({
    // apiUrl: process.env.VUE_APP_URL,
    apiUrl: "http://127.0.0.1:8000",
    reportData: [],
    reportSetting: [],
    startDate: "",
    endDate: "",
    categoryId: [],
    periodeLength: "",
  }),
  actions: {
    async getReport() {
      try {
        const url = `${this.apiUrl}/api/v1/saleses`;
        const res = await axios.get(url);
        this.reportData = res.data.data.list;
      } catch (err) {
        console.log(err);
      }
    },
    async changeDate(date) {
      this.startDate = date[0];
      this.endDate = date[1];
    },
    async changeCustomer(category) {
      console.log(category);
      this.categoryId = category;
    },
  },
});
