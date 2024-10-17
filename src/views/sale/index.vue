<template>
    <Layout>
        <PageHeader title="Transaction" pageTitle="Sale" />
        <Brow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom d-flex">
                        <BFormSelect class="form-select m-2" v-model="formModel.customer_id" :class="{
                            'is-invalid': !!(customerErrorList && customerErrorList.customer_id)
                        }" id="form-customer" :style="{
                            color: formModel.customer_id === '' ? '#7c8094' : '',
                            width: '286px'
                        }">
                            <BFormSelectOption :value="''" :disabled="true">Pilih Pelanggan</BFormSelectOption>
                            <BFormSelectOption v-for="customer in customers" :key="customer.id" :value="customer.id">
                                {{ customer.name }}
                            </BFormSelectOption>
                        </BFormSelect>
                        <template v-if="!!(customerErrorList && customerErrorList.customer_id)">
                            <div class="invalid-feedback" v-for="(err, index) in customerErrorList.customer_id"
                                :key="index">
                                <span>{{ err }}</span>
                            </div>
                        </template>
                        <BRow class="g-3">
                            <BCol xxl="10" style="width: 330px;">
                                <BFormInput type="text" class="form-control m-2 search" placeholder="Menu name ..."
                                    v-model="productStore.searchQuery" @keydown.enter="searchData" />
                            </BCol>
                        </BRow>
                        <BModal v-model="isOpenForm" size="lg" id="modal-standard" :title="modalTitle"
                            title-class="font-18" ok-title="Simpan" @ok="saveCustomer" @hide.prevent
                            @cancel="isOpenForm = false" @close="isOpenForm = false">
                            <BRow>
                                <BCol cols="12">
                                    <img :src="imageUrl" alt="User Photo"
                                        class="rounded-circle position-absolute top-0 end-0 shadow-sm bg-white rounded border border-light"
                                        style="width: 100px; height: 100px; object-fit: cover; margin: 30px 40px 0 0;">
                                    <ImageCropper :aspectRatio="1 / 1"
                                        :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
                                        @update:imageUrl="imageUrl = $event"
                                        @update:croppedImageUrl="croppedImageUrl = $event; customerFormModel.photo = $event;" />
                                </BCol>
                                <BCol cols="12" class="mt-4">
                                    <BForm class="form-horizontal" role="form">
                                        <BRow class="mb-3">
                                            <label class="col-md-2 col-form-label" for="form-name">Name</label>
                                            <BCol md="10">
                                                <input class="form-control" :class="{
                                                    'is-invalid': !!(customerErrorList && customerErrorList.name),
                                                }" id="form-name" placeholder="Masukkan Nama"
                                                    v-model="customerFormModel.name" />
                                                <template v-if="!!(customerErrorList && customerErrorList.name)">
                                                    <div class="invalid-feedback"
                                                        v-for="(err, index) in customerErrorList.name" :key="index">
                                                        <span>{{ err }}</span>
                                                    </div>
                                                </template>
                                            </BCol>
                                        </BRow>
                                        <BRow class="mb-3">
                                            <label for="form-email" class="col-md-2 col-form-label">Email</label>
                                            <BCol md="10">
                                                <input class="form-control" :class="{
                                                    'is-invalid': !!(customerErrorList && customerErrorList.email),
                                                }" id="form-email" type="email" placeholder="Masukkan email"
                                                    v-model="customerFormModel.email" />
                                                <template v-if="!!(customerErrorList && customerErrorList.email)">
                                                    <div class="invalid-feedback"
                                                        v-for="(err, index) in customerErrorList.email" :key="index">
                                                        <span>{{ err }}</span>
                                                    </div>
                                                </template>
                                            </BCol>
                                        </BRow>
                                        <BRow class="mb-3">
                                            <label for="form-password" class="col-md-2 col-form-label">Password</label>
                                            <BCol md="10">
                                                <input class="form-control" :class="{
                                                    'is-invalid': !!(
                                                        customerErrorList && customerErrorList.password
                                                    ),
                                                }" id="form-password" type="password" placeholder="Masukkan password"
                                                    v-model="customerFormModel.password" />
                                                <template v-if="!!(customerErrorList && customerErrorList.password)">
                                                    <div class="invalid-feedback"
                                                        v-for="(err, index) in customerErrorList.password" :key="index">
                                                        <span>{{ err }}</span>
                                                    </div>
                                                </template>
                                            </BCol>
                                        </BRow>
                                        <BRow class="mb-3">
                                            <label for="form-phone" class="col-md-2 col-form-label">Phone</label>
                                            <BCol md="10">
                                                <input class="form-control" :class="{
                                                    'is-invalid': !!(
                                                        customerErrorList && customerErrorList.phone
                                                    ),
                                                }" id="form-phone" type="phone" placeholder="Masukkan phone"
                                                    v-model="customerFormModel.phone" />
                                                <template v-if="!!(customerErrorList && customerErrorList.phone)">
                                                    <div class="invalid-feedback"
                                                        v-for="(err, index) in customerErrorList.phone" :key="index">
                                                        <span>{{ err }}</span>
                                                    </div>
                                                </template>
                                            </BCol>
                                        </BRow>
                                        <BRow class="mb-3">
                                            <label for="form-address" class="col-md-2 col-form-label">Address</label>
                                            <BCol md="10">
                                                <input class="form-control" :class="{
                                                    'is-invalid': !!(
                                                        customerErrorList && customerErrorList.address
                                                    ),
                                                }" id="form-address" type="address" placeholder="Masukkan address"
                                                    v-model="customerFormModel.address" />
                                                <template v-if="!!(customerErrorList && customerErrorList.address)">
                                                    <div class="invalid-feedback"
                                                        v-for="(err, index) in customerErrorList.address" :key="index">
                                                        <span>{{ err }}</span>
                                                    </div>
                                                </template>
                                            </BCol>
                                        </BRow>
                                    </BForm>
                                </BCol>
                            </BRow>
                        </BModal>
                    </BCardBody>
                </BCard>
            </BCol>
        </Brow>
        <BRow class="g-3">
            <BCol :lg="largeProductGalery" md="12">
                <BRow>
                    <BCol lg="3" md="4" sm="6" v-for="product in products" :key="product.id">
                        <BCard @click="selectProduct(product)">
                            <div class="position-relative">
                                <img :src="product.photo_url || 'https://via.placeholder.com/150'" class="card-img-top"
                                    alt="Product Image"
                                    style="height: 150px; object-fit: cover; border-radius: 0.5rem;">
                                <BButton
                                    class="btn btn-sm btn-soft-info position-absolute top-0 end-0 m-2 bg-secondary shadow-sm"
                                    @click="editProduct(product.id)">
                                    <i class="mdi mdi-pencil-outline" style="color: white;"></i>
                                </BButton>
                            </div>
                            <BCardBody>
                                <h5 class="card-title text-truncate">{{ product.name }}</h5>
                                <p class="card-text">Rp{{ product.price }}</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>

            <BCol lg="4" md="12" v-if="formModel.customer_id">
                <BCard class="shadow-sm">
                    <BCardHeader>
                        <h5 class="mb-1">Detail Order</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="text-primary" style="font-weight: bold; margin-top: 16px">{{
                                formModel.customer_name }}
                            </h5>
                            <BButton class="btn btn-sm shadow-sm" variant="primary"
                                style="height: auto; line-height: normal;"
                                @click="openFormModal('edit', formModel.customer_id)">
                                <i class="mdi mdi-pencil-outline" style="color: white;"></i>
                            </BButton>
                        </div>
                    </BCardHeader>
                    <BCardBody>
                        <form>
                            <hr style="margin-top: -1px;">
                            <div v-if="selectedProduct.length > 0">
                                <div v-for="product in selectedProduct" :key="product.id" class="mb-2">
                                    <div class="d-flex align-items-center">
                                        <div class="d-flex align-items-center" @click="selectProduct(product)" style="cursor: pointer">
                                            <img :src="product.photo_url || 'https://via.placeholder.com/50'"
                                                class="img-thumbnail me-2" alt="Product Image"
                                                style="width: 50px; height: 50px; object-fit: cover;">
                                            <div>
                                                <h6 class="mb-1 text-truncate">{{ product.name }}</h6>
                                                <p class="mb-0">Rp{{ product.price }}</p>
                                            </div>
                                        </div>

                                        <div class="ms-auto d-flex align-items-center">
                                            <BButton variant="outline-secondary" size="sm"
                                                @click="decrementItem(product)">
                                                -
                                            </BButton>
                                            <span class="mx-3">{{ product.total_item }}</span>
                                            <BButton variant="outline-primary" size="sm"
                                                @click="incrementItem(product)">
                                                +
                                            </BButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>Silahkan pilih menu</p>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between" style="margin-bottom: 16px; font-weight: bold;">
                                <span>Total Pembayaran</span>
                                <span>Rp{{ totalPrice }}</span>
                            </div>
                            <BButton variant="primary" class="w-100" :disabled="selectedProduct.length === 0"
                                @click="saveSales()">
                                Tambah Pesanan
                            </BButton>
                        </form>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>

    </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useProductStore, useCustomerStore, useSaleStore } from "../../state/pinia";
import { useProgress } from "@/helpers/progress";
import { onMounted, ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import ImageCropper from "@/components/widgets/cropper";
import {
    showSuccessToast,
    showErrorToast,
} from "@/helpers/alert.js";

var isOpenForm = ref(false);
var modalTitle = ref(false);
const imageUrl = ref("");
const croppedImageUrl = ref("");
const customerFormModel = reactive({
    id: "",
    m_user_id: "",
    name: "",
    email: "",
    password: "",
    photo: "",
    phone: "",
    address: "",
});

const router = useRouter();
const productStore = useProductStore();
const customerStore = useCustomerStore();
const saleStore = useSaleStore();
const { startProgress, finishProgress, failProgress } = useProgress();
const products = ref([]);
const customers = ref([]);
var largeProductGalery = "12";
const product_detail = ref([]);

const formModel = reactive({
    customer_id: '',
    customer_name: '',
    product_detail: product_detail.value
});

const selectedProduct = ref([]);
const selectedProductId = ref([]);
const totalPrice = ref(0);

const getProducts = async () => {
    const perPage = 16;
    startProgress();
    await productStore.getProducts(perPage)
    if (productStore.products) {
        finishProgress();
        products.value = productStore.products || [];
    } else {
        failProgress();
        products.value = [];
    }
}

const getCustomers = async () => {
    const perPage = 16;
    startProgress();
    await customerStore.getCustomers(perPage);
    if (customerStore.customers) {
        finishProgress();
        customers.value = customerStore.customers || [];
    } else {
        failProgress();
        customers.value = [];
    }
};

watch(() => formModel.customer_id, (newId) => {
    const selectedCustomer = customers.value.find(customer => customer.id === newId);
    formModel.customer_name = selectedCustomer ? selectedCustomer.name : '';
    largeProductGalery = "8";
    selectedProduct.value = [];
});

const editProduct = async (id) => {
    productStore.openForm('edit')
    router.push({
        name: 'product-form', params: {
            previousPage: 'sale'
        }
    });
    await productStore.getProductById(id)
}

const searchData = async () => {
    await productStore.changePage(1);
    await getProducts();
};

const openFormModal = (mode, id = null) => {
    isOpenForm.value = true;
    if (mode === "edit" && id) {
        const customer = customers.value.find((customer) => customer.id === id);

        if (customer) {
            customerFormModel.id = customer.id;
            customerFormModel.m_user_id = customer.m_user_id;
            customerFormModel.name = customer.name;
            customerFormModel.email = customer.email;
            customerFormModel.password = ""; // Password should be handled securely
            customerFormModel.photo = null;
            customerFormModel.phone = customer.phone;
            customerFormModel.address = customer.address;
            modalTitle.value = "Ubah Customer";
            imageUrl.value = customer.photo_url;
        }
    } else {
        customerFormModel.id = "";
        customerFormModel.name = "";
        customerFormModel.email = "";
        customerFormModel.password = "";
        customerFormModel.photo = "";
        customerFormModel.phone = "";
        customerFormModel.address = "";
        modalTitle.value = "Tambah Customer";
    }
};

const customerStatusCode = computed(() => customerStore.error.status);
const customerErrorList = computed(() => customerStore.error?.list || {});
const customerErrorMessage = computed(() => customerStore.error?.message || "");

const saleStatusCode = computed(() => saleStore.response.status);
const saleErrorMessage = computed(() => saleStore.error?.message || "");

const saveCustomer = async () => {
    try {
        if (customerFormModel.id) {
            formModel.customer_name = customerFormModel.name;
            await customerStore.updateCustomer(customerFormModel);
            if (customerStatusCode.value != 200) {
                showErrorToast("Failed to add customer", customerErrorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCustomers(); // Refresh the customer list after deletion
                showSuccessToast("Customer Edited successfully!");
            }
        } else {
            await customerStore.addCustomers(customerFormModel);
            if (customerStatusCode.value != 200) {
                showErrorToast("Failed to add customer", customerErrorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCustomers(); // Refresh the customer list after deletion
                showSuccessToast("Customer added successfully!");
            }
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Failed to add customer", customerErrorMessage.value);
    }
};

const selectProduct = (product) => {
    if (formModel.customer_id != '') {
        const index = selectedProductId.value.indexOf(product.id);
        if (index === -1) {
            const productWithTotalItem = { ...product, total_item: 1 };
            selectedProduct.value.push(productWithTotalItem);
            selectedProductId.value.push(product.id);
        } else {
            selectedProduct.value.splice(index, 1);
            selectedProductId.value.splice(index, 1);
        }
        calculateTotalPrice();
    }
};

const incrementItem = (product) => {
    product.total_item += 1;
    calculateTotalPrice();
};

const decrementItem = (product) => {
    if (product.total_item > 1) {
        product.total_item -= 1;
    } else {
        const index = selectedProductId.value.indexOf(product.id);
        selectedProduct.value.splice(index, 1);
        selectedProductId.value.splice(index, 1);
    }
    calculateTotalPrice();
};

const calculateTotalPrice = () => {
    totalPrice.value = selectedProduct.value.reduce((sum, product) => {
        return sum + (product.price * product.total_item);
    }, 0);
};

const saveSales = async () => {
    try {
        updateFormModel();
        await saleStore.addSale(formModel);
        if (saleStatusCode.value != 200) {
            showErrorToast("Failed to add sales", saleErrorMessage.value);
        } else {
            showSuccessToast("Sale added successfully!");
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Failed to add Sale", saleErrorMessage.value);
    }
}

const updateFormModel = () => {
    for (var i = 0; i < selectedProduct.value.length; i++) {
        for (var j = 0; j < selectedProduct.value[i].details.length; j++) {
            product_detail.value.push(
                {
                    m_product_id: selectedProduct.value[i].id,
                    m_product_detail_id: selectedProduct.value[i].details[j].id,
                    total_item: selectedProduct.value[i].total_item,
                    price: selectedProduct.value[i].details[j].price,
                    is_added: true,
                }
            );
        }
    }
}

onMounted(async () => {
    await getProducts();
    await getCustomers();
})
</script>