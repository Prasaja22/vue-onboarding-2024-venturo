<template>
    <Layout>
        <PageHeader title="Categories List" pageTitle="Categories" />
        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">
                        <div class="d-flex align-items-center">
                            <BCardTitle class="mb-0 flex-grow-1">Category List</BCardTitle>
                            <div class="flex-shrink-0">
                                <BButton class="btn btn-primary me-1" @click="openFormModal('add', null)">Add Category
                                </BButton>
                                <BModal v-model="isOpenForm" size="lg" id="modal-standard" :title="modalTitle"
                                    title-class="font-18" ok-title="Simpan" @ok="saveCategory" @hide.prevent
                                    @cancel="isOpenForm = false" @close="isOpenForm = false">
                                    <BRow>
                                        <BCol cols="12" class="mt-4">
                                            <BForm class="form-horizontal" role="form">
                                                <BRow class="mb-3">
                                                    <label class="col-md-2 col-form-label" for="form-name">Name</label>
                                                    <BCol md="10">
                                                        <input class="form-control" :class="{
                                                            'is-invalid': !!(errorList && errorList.name),
                                                        }" id="form-name" placeholder="Masukkan Nama"
                                                            v-model="formModel.name" />
                                                        <template v-if="!!(errorList && errorList.name)">
                                                            <div class="invalid-feedback"
                                                                v-for="(err, index) in errorList.name" :key="index">
                                                                <span>{{ err }}</span>
                                                            </div>
                                                        </template>
                                                    </BCol>
                                                </BRow>
                                            </BForm>
                                        </BCol>
                                    </BRow>
                                </BModal>
                                <BLink href="#!" class="btn btn-light me-1" @click="getCategories"><i
                                        class="mdi mdi-refresh"></i></BLink>
                            </div>
                        </div>
                    </BCardBody>
                    <BCardBody class="border-bottom">
                        <BRow class="g-3">
                            <BCol xxl="10" lg="8">
                                <BFormInput type="text" class="form-control search" placeholder="Search for ..."
                                    v-model="categoryStore.searchQuery" />
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
                            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="user-list">
                                <BThead>
                                    <BTr>
                                        <BTh scope="col">Name</BTh>
                                        <BTh scope="col"></BTh>
                                    </BTr>
                                </BThead>

                                <BTbody>
                                    <BTr v-for="category in rows" :key="category.id">
                                        <BTd> {{ category.name }} </BTd>
                                        <BTd>
                                            <ul class="list-unstyled hstack gap-1 mb-0 justify-content-end">
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit"
                                                    @click="openFormModal('edit', category.id)">
                                                    <BButton class="btn btn-sm btn-soft-info"><i
                                                            class="mdi mdi-pencil-outline"></i>
                                                    </BButton>
                                                </li>
                                                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete"
                                                    @click="deleteCategory(category.id)">
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
                        <Pagination :currentPage="categoryStore.current" :totalRows="categoryStore.totalData"
                            :perPage="categoryStore.perpage" @update:currentPage="updatePage" />
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
import { useCategoryStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress"; // Import custom progress function

const { startProgress, finishProgress, failProgress } = useProgress();

import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirmationDialog,
} from "@/helpers/alert.js";
// import useVuelidate from "@vuelidate/core";

var rows = ref([]);
var isOpenForm = ref(false);
var modalTitle = ref(false);
const categoryStore = useCategoryStore();

const getCategories = async () => {
    startProgress();
    await categoryStore.getCategories();
    if (categoryStore.categories) {
        finishProgress();
        rows.value = categoryStore.categories || [];
    } else {
        failProgress();
        rows.value = [];
    }
};

const updatePage = async (page) => {
    await categoryStore.changePage(page);
    await getCategories();
};

const searchData = async () => {
    await categoryStore.changePage(1);
    await getCategories();
};

const formModel = reactive({
    id: "",
    name: "",
});

const openFormModal = (mode, id = null) => {
    isOpenForm.value = true;
    if (mode === "edit" && id) {
        const category = rows.value.find((category) => category.id === id);
        if (category) {
            formModel.id = category.id;
            formModel.name = category.name;
            modalTitle.value = "Ubah Kategori";
        }
    } else {
        formModel.id = "";
        formModel.name = "";
        modalTitle.value = "Tambah Kategori";
    }
};

const statusCode = computed(() => categoryStore.error.status);
const errorList = computed(() => categoryStore.error?.list || {});
const errorMessage = computed(() => categoryStore.error?.message || "");

const saveCategory = async () => {
    try {
        if (formModel.id) {
            await categoryStore.updateCategory(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add category", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCategories(); // Refresh the category list after deletion
                showSuccessToast("Category Edited successfully!");
            }
        } else {
            await categoryStore.addCategories(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add category", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCategories(); // Refresh the category list after deletion
                showSuccessToast("Category added successfully!");
            }
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Failed to add category", errorMessage.value);
    }
};

const deleteCategory = async (id) => {
    // Tampilkan dialog konfirmasi
    const confirmed = await showDeleteConfirmationDialog();
    // Jika konfirmasi
    if (confirmed) {
        try {
            await categoryStore.deleteCategory(id);
            showSuccessToast("Category berhasil dihapus");
            await getCategories(); // Refresh the category list after deletion
        } catch (error) {
            showErrorToast("Terjadi kesalahan saat menghapus category");
        }
    }
};

onMounted(async () => {
    await getCategories();
});
</script>