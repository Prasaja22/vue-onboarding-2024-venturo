<template>
    <Layout>
        <BRow>
            <BRow class="align-items-center justify-content-between mb-3">
                <BCol md="4">
                    <DateRange v-model="selectedDate" :enableTimePicker="false" date-format="yyyy-MM-dd"
                        time-format="HH:mm:ss" maxRange="30" defaultStartDate="1" />
                </BCol>
                <BCol md="2">
                    <BButton variant="success" @click="downloadExcelReport">
                        Excel
                    </BButton>
                </BCol>
                <BCol md="2">
                    <BFormSelect class="form-select" v-model="category_id" :class="{
                        'is-invalid': !!(errorList && errorList.category_id),
                    }" id="form-category" :style="{
                        color: category_id === '' ? '#7c8094' : '',
                    }" @change="updateCategory()">
                        <BFormSelectOption :value="''" :disabled="true">Pilih Kategori</BFormSelectOption>
                        <BFormSelectOption :value="''">All</BFormSelectOption>
                        <BFormSelectOption v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </BFormSelectOption>
                    </BFormSelect>
                    <template v-if="!!(errorList && errorList.product_category_id)">
                        <div class="invalid-feedback" v-for="(err, index) in errorList.product_category_id"
                            :key="index">
                            <span>{{ err }}</span>
                        </div>
                    </template>
                </BCol>
            </BRow>
            <BCol lg="12">
                <BCard no-body class="pb-5">
                    <BCardBody>
                        <div class="table-responsive mb-5">
                            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="sale-list">
                                <BThead class="table-primary">
                                    <BTr>
                                        <BTh rowspan="2" scope="col">Menu</BTh>
                                        <BTh :colspan="dates.length" scope="col" class="text-center">Periode: {{ month
                                            }}</BTh>
                                        <BTh rowspan="2" scope="col">Total</BTh>
                                    </BTr>
                                    <BTr>
                                        <BTh v-for="date in dates" :key="date" scope="col" class="text-center">
                                            {{ date }}
                                        </BTh>
                                    </BTr>
                                </BThead>
                                <BTbody>
                                    <BTr>
                                        <BTd>Grand Total</BTd>
                                        <BTd v-for="date in dates" :key="date" class="text-center">.</BTd>
                                        <BTd>{{ grandTotal }}</BTd>
                                    </BTr>
                                    <template v-for="(report, reportIndex) in reports" :key="report.category_id">
                                        <BTr class="table-light">
                                            <BTd colspan="1" class="fw-bold">{{ report.category_name }}</BTd>
                                            <BTd v-for="date in dates" :key="date + reportIndex"></BTd>
                                            <BTd class="fw-bold">{{ report.category_total.toLocaleString('id-ID') }}
                                            </BTd>
                                        </BTr>
                                        <BTr v-for="(product, prodIndex) in report.products" :key="product.product_id">
                                            <BTd>{{ product.product_name }}</BTd>
                                            <BTd v-for="transaction in product.transactions"
                                                :key="transaction.date_transaction + prodIndex" class="text-center">
                                                {{ transaction.total_sales ?
                                                    transaction.total_sales.toLocaleString('id-ID') : '.' }}
                                            </BTd>
                                            <BTd>{{ product.transactions_total.toLocaleString('id-ID') }}</BTd>
                                        </BTr>
                                    </template>
                                </BTbody>
                            </BTableSimple>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import Layout from "../../../layouts/main";
import { useReportStore, useCategoryStore } from "../../../state/pinia";
import { useProgress } from "@/helpers/progress";
import { ref, onMounted, computed, watch } from "vue";
import DateRange from '@/components/date-range';

const { startProgress, finishProgress, failProgress } = useProgress();

const reports = ref([]);
const dates = ref([]);
const month = ref();
const grandTotal = ref();
const reportStore = useReportStore();
const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);
const category_id = ref('');
const errorList = computed(() => reportStore.response?.list || {});

const selectedDate = ref();

watch(selectedDate, async (newDate) => {
    if (Array.isArray(newDate)) {
        await reportStore.changeDate(newDate)
        await getReports()
    }
});

const getCategory = async () => {
    await categoryStore.getCategories()
}

const updateCategory = async () => {
    await getReports();
};

const getReports = async () => {
    startProgress();
    await reportStore.getReportsByCategory(category_id.value);
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
            const date = reportStore.dates[i].split('-')[2];
            dates.value.push(date);
        }
    }

    if (reportStore.grand_total) {
        grandTotal.value = reportStore.grand_total.toLocaleString('id-ID');
    } else {
        grandTotal.value = 0;
    }
};

const getMonthAndYear = (dateString) => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const [year, month] = dateString.split('-');
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${year}`;
};

const downloadExcelReport = async () => {
    await reportStore.downloadSalesCategoryReport();
}

onMounted(async () => {
    await getReports();
    await getCategory();
});

</script>