<template>
    <Layout>
        <PageHeader title="Customers List" pageTitle="Customers" />
        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">
                        <div class="d-flex align-items-center">
                            <BCardTitle class="mb-0 flex-grow-1">Customer List</BCardTitle>
                            <div class="flex-shrink-0">
                                <BButton class="btn btn-primary me-1" @click="openFormModal('add', null)">Add Customer
                                </BButton>
                                <CustomerForm></CustomerForm>
                                <BLink href="#!" class="btn btn-light me-1" @click="getCustomers"><i
                                        class="mdi mdi-refresh"></i></BLink>
                            </div>
                        </div>
                    </BCardBody>
                    <BCardBody class="border-bottom">
                        <BRow class="g-3">
                            <BCol xxl="10" lg="8">
                                <BFormInput type="text" class="form-control search" placeholder="Search for ..."
                                    v-model="customerStore.searchQuery" />
                            </BCol>
                            <BCol xxl="2" lg="4">
                                <BButton variant="soft-secondary" @click="searchData" class="w-100">
                                    <i class="mdi mdi-magnify align-middle"></i>
                                    Cari
                                </BButton>
                            </BCol>
                        </BRow>
                    </BCardBody>
                    <BCardBody>
                        <div class="table-responsive">
                            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check"
                                id="customer-list">
                                <BThead>
                                    <BTr>
                                        <BTh scope="col">Name</BTh>
                                        <BTh scope="col">Email</BTh>
                                        <BTh scope="col">Phone</BTh>
                                        <BTh scope="col">Address</BTh>
                                        <BTh scope="col"></BTh>
                                    </BTr>
                                </BThead>

                                <BTbody>
                                    <BTr v-for="customer in customers" :key="customer.id">
                                        <BTd> {{ customer.name }} </BTd>
                                        <BTd> {{ customer.email }} </BTd>
                                        <BTd> {{ customer.phone }} </BTd>
                                        <BTd> {{ customer.address }} </BTd>
                                        <BTd>
                                            <ul class="list-unstyled hstack gap-1 mb-0 justify-content-end">
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit"
                                                    @click="openFormModal('edit', customer.id)">
                                                    <BButton class="btn btn-sm btn-soft-info"><i
                                                            class="mdi mdi-pencil-outline"></i>
                                                    </BButton>
                                                </li>
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete"
                                                    @click="deleteCustomer(customer.id)">
                                                    <BButton data-bs-toggle="modal" class="btn btn-sm btn-soft-danger">
                                                        <i class="mdi mdi-delete-outline"></i>
                                                    </BButton>
                                                </li>
                                            </ul>
                                        </BTd>
                                    </BTr>
                                </BTbody>
                            </BTableSimple>
                        </div>
                        <Pagination :currentPage="customerStore.current" :totalcustomers="customerStore.totalData"
                            :perPage="customerStore.perpage" @update:currentPage="updatePage" />
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";
import { useCustomerStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress"; // Import custom progress function

const { startProgress, finishProgress, failProgress } = useProgress();

import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirmationDialog,
} from "@/helpers/alert.js";
// import useVuelidate from "@vuelidate/core";

var customers = ref([]);
var isOpenForm = ref(false);
var modalTitle = ref(false);
const customerStore = useCustomerStore();

const getCustomers = async () => {
    startProgress();
    await customerStore.getCustomers();
    if (customerStore.customers) {
        finishProgress();
        customers.value = customerStore.customers || [];
    } else {
        failProgress();
        customers.value = [];
    }
};

const updatePage = async (page) => {
    await customerStore.changePage(page);
    await getCustomers();
};

const searchData = async () => {
    await customerStore.changePage(1);
    await getCustomers();
};

const openFormModal = (mode, id = null) => {
    isOpenForm.value = true;
    if (mode === "edit" && id) {
        const customer = customers.value.find((customer) => customer.id === id);
        if (customer) {
            formModel.id = customer.id;
            formModel.m_user_id = customer.m_user_id;
            formModel.name = customer.name;
            formModel.email = customer.email;
            formModel.password = ""; // Password should be handled securely
            formModel.photo = null;
            formModel.phone = customer.phone;
            formModel.address = customer.address;
            modalTitle.value = "Ubah Customer";
            imageUrl.value = customer.photo_url;
            imageEdit.value = customer.photo_url;
        }
    } else {
        modalTitle.value = "Tambah Customer";
    }
};

const errorList = computed(() => customerStore.error?.list || {});

const deleteCustomer = async (id) => {
    // Tampilkan dialog konfirmasi
    const confirmed = await showDeleteConfirmationDialog();
    // Jika konfirmasi
    if (confirmed) {
        try {
            await customerStore.deleteCustomer(id);
            showSuccessToast("Customer berhasil dihapus");
            await getCustomers(); // Refresh the customer list after deletion
        } catch (error) {
            showErrorToast("Terjadi kesalahan saat menghapus customer");
        }
    }
};

onMounted(async () => {
    await getCustomers();
});
</script>