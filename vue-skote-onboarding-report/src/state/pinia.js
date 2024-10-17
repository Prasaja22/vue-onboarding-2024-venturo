import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { createPinia } from "pinia";
import { useReportCategoryStore } from "./pinia/report-category";
import { useReportCustomerStore } from "./pinia/report-customer";

const pinia = createPinia();
export default pinia;

export {
  useLayoutStore,
  useAuthStore,
  useUserStore,
  useReportCustomerStore,
  useReportCategoryStore,
};
