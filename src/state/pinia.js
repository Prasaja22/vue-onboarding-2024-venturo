import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { createPinia } from "pinia";
import { useCustomerStore } from "./pinia/customer";
import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";
import { useTransaksiStore } from "./pinia/transaksi";
import { useReportCategoryStore } from "./pinia/report-category";
import { useReportStore } from "./pinia/report";

const pinia = createPinia();
export default pinia;

export {
  useLayoutStore,
  useAuthStore,
  useUserStore,
  useCustomerStore,
  useProductCategoryStore,
  useProductStore,
  useTransaksiStore,
  useReportCategoryStore,
  useReportStore,
};
