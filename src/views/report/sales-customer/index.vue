<template>
  <layout>
    <BRow>
      <BRow class="align-items-center justify-content-between mb-3">
        <BCol md="4">
          <DateRange
            v-model="selectedDate"
            :enableTimePicker="false"
            date-format="yyyy-MM-dd"
            time-format="HH:mm:ss"
            maxRange="30"
            defaultStartDate="1"
          />
        </BCol>
        <BCol md="2">
          <BButton variant="success" @click="downloadExcelReport">
            Excel
          </BButton>
        </BCol>
        <BCol md="2">
          <BFormSelect
            class="form-select"
            v-model="customer_id"
            :class="{
              'is-invalid': !!(errorList && errorList.customer_id),
            }"
            id="form-customer"
            :style="{
              color: customer_id === '' ? '#7c8094' : '',
            }"
            @change="updateCustomer()"
          >
            <BFormSelectOption :value="''" :disabled="true"
              >Pilih Pelanggan</BFormSelectOption
            >
            <BFormSelectOption :value="''">All</BFormSelectOption>
            <BFormSelectOption
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </BFormSelectOption>
          </BFormSelect>
          <template v-if="!!(errorList && errorList.customer_id)">
            <div
              class="invalid-feedback"
              v-for="(err, index) in errorList.customer_id"
              :key="index"
            >
              <span>{{ err }}</span>
            </div>
          </template>
        </BCol>
      </BRow>
      <BCol lg="12">
        <BCard no-body class="pb-5">
          <BCardBody>
            <div class="table-responsive mb-5">
              <BTableSimple
                class="align-middle dt-responsive nowrap w-100 table-check"
                id="sale-list"
              >
                <BThead class="table-primary">
                  <BTr>
                    <BTh rowspan="2" scope="col">No</BTh>
                    <BTh rowspan="2" scope="col">Customer</BTh>
                    <BTh :colspan="dates.length" scope="col" class="text-center"
                      >Periode: {{ month }}</BTh
                    >
                    <BTh rowspan="2" scope="col">Total</BTh>
                  </BTr>
                  <BTr>
                    <BTh
                      v-for="date in dates"
                      :key="date"
                      scope="col"
                      class="text-center"
                    >
                      {{ date }}
                    </BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr
                    v-for="(report, index) in reports"
                    :key="report.customer_id"
                  >
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ report.customer_name }}</BTd>
                    <BTd
                      v-for="transaction in report.transactions"
                      :key="transaction.date_transaction + prodIndex"
                      class="text-center"
                    >
                      {{
                        transaction.total_sales
                          ? transaction.total_sales.toLocaleString("id-ID")
                          : "."
                      }}
                    </BTd>
                    <BTd>{{
                      report.customer_total.toLocaleString("id-ID")
                    }}</BTd>
                  </BTr>
                  <BTr>
                    <BTd>-</BTd>
                    <BTd class="fw-bold">Grand Total</BTd>
                    <BTd
                      v-for="date in dates"
                      :key="date"
                      class="text-center fw-bold"
                      >.</BTd
                    >
                    <BTd class="fw-bold">{{ grandTotal }}</BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </layout>
</template>

<script setup>
import Layout from "../../../layouts/main";
import { useReportStore, useCustomerStore } from "../../../state/pinia";
import { useProgress } from "@/helpers/progress";
import { ref, onMounted, computed, watch } from "vue";
import DateRange from "@/components/date-range";

const { startProgress, finishProgress, failProgress } = useProgress();

var reports = ref([]);
const dates = ref([]);
const month = ref();
const grandTotal = ref();
const reportStore = useReportStore();
const customerStore = useCustomerStore();

const customer_id = ref("");
const customers = computed(() => customerStore.customers);
const errorList = computed(() => reportStore.response?.list || {});

const selectedDate = ref();

watch(selectedDate, async (newDate) => {
  if (Array.isArray(newDate)) {
    await reportStore.changeDate(newDate);
    await getReports();
  }
});

const getCustomers = async () => {
  const perPage = 16;
  await customerStore.getCustomers(perPage);
};

const updateCustomer = async () => {
  await getReports();
};

const getReports = async () => {
  startProgress();
  await reportStore.getReportsByCustomer(customer_id);
  if (reportStore.reports) {
    finishProgress();
    reports.value = reportStore.reports || [];
  } else {
    failProgress();
    reports.value = [];
  }

  if (reportStore.dates) {
    month.value = getMonthAndYear(reportStore.dates[0]);
    dates.value = [];

    for (var i = 0; i < reportStore.dates.length; i++) {
      const date = reportStore.dates[i].split("-")[2];
      dates.value.push(date);
    }
  }

  if (reportStore.grand_total) {
    grandTotal.value = reportStore.grand_total.toLocaleString("id-ID");
  } else {
    grandTotal.value = 0;
  }
};

const getMonthAndYear = (dateString) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [year, month] = dateString.split("-");
  const monthName = months[parseInt(month) - 1];
  return `${monthName} ${year}`;
};

onMounted(async () => {
  await getReports();
  await getCustomers();
});

const downloadExcelReport = async () => {
  await reportStore.downloadSalesCustomerReport();
};
</script>
