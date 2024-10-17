<template>
    <BModal v-model="isOpenForm" size="lg" id="modal-standard" :title="modalTitle" title-class="font-18"
        ok-title="Simpan" @ok="saveCustomer" @hide.prevent @cancel="closeModal" @close="closeModal">
        <BRow>
            <BCol cols="12">
                <BCard v-if="imageEdit">
                    <div class="preview d-flex">
                        <div class="delete-button" @click="clearEditImage">
                            <BButton class="btn btn-sm btn-danger">
                                <i class="mdi mdi-delete-outline"></i>
                            </BButton>
                        </div>
                        <img :src="imageEdit" alt="Cropped Image" class="mx-auto" />
                    </div>
                </BCard>
                <BCard no-body v-else>
                    <ImageCropper :maxFileSize="maxFileSize" :aspectRatio="1 / 1"
                        :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
                        @file-too-large="handleFileTooLarge" @update:imageUrl="imageUrl = $event"
                        @update:croppedImageUrl="croppedImageUrl = $event;
                        formModel.photo = $event" />
                </BCard>
            </BCol>
            <BCol cols="12" class="mt-4">
                <BForm class="form-horizontal" role="form">
                    <BRow class="mb-3">
                        <label class="col-md-2 col-form-label" for="form-name">Name</label>
                        <BCol md="10">
                            <input class="form-control" :class="{ 'is-invalid': !!errorList?.name }" id="form-name"
                                placeholder="Masukkan Nama" v-model="formModel.name" />
                            <template v-if="errorList?.name">
                                <div class="invalid-feedback" v-for="(err, index) in errorList.name" :key="index">
                                    <span>{{ err }}</span>
                                </div>
                            </template>
                        </BCol>
                    </BRow>
                    <BRow class="mb-3">
                        <label for="form-email" class="col-md-2 col-form-label">Email</label>
                        <BCol md="10">
                            <input class="form-control" :class="{ 'is-invalid': !!errorList?.email }" id="form-email"
                                type="email" placeholder="Masukkan email" v-model="formModel.email" />
                            <template v-if="errorList?.email">
                                <div class="invalid-feedback" v-for="(err, index) in errorList.email" :key="index">
                                    <span>{{ err }}</span>
                                </div>
                            </template>
                        </BCol>
                    </BRow>
                    <BRow class="mb-3">
                        <label for="form-password" class="col-md-2 col-form-label">Password</label>
                        <BCol md="10">
                            <input class="form-control" :class="{ 'is-invalid': !!errorList?.password }"
                                id="form-password" type="password" placeholder="Masukkan password"
                                v-model="formModel.password" />
                            <template v-if="errorList?.password">
                                <div class="invalid-feedback" v-for="(err, index) in errorList.password" :key="index">
                                    <span>{{ err }}</span>
                                </div>
                            </template>
                        </BCol>
                    </BRow>
                    <BRow class="mb-3">
                        <label for="form-phone" class="col-md-2 col-form-label">Phone</label>
                        <BCol md="10">
                            <input class="form-control" :class="{ 'is-invalid': !!errorList?.phone }" id="form-phone"
                                type="phone" placeholder="Masukkan phone" v-model="formModel.phone" />
                            <template v-if="errorList?.phone">
                                <div class="invalid-feedback" v-for="(err, index) in errorList.phone" :key="index">
                                    <span>{{ err }}</span>
                                </div>
                            </template>
                        </BCol>
                    </BRow>
                    <BRow class="mb-3">
                        <label for="form-address" class="col-md-2 col-form-label">Address</label>
                        <BCol md="10">
                            <input class="form-control" :class="{ 'is-invalid': !!errorList?.address }"
                                id="form-address" type="address" placeholder="Masukkan address"
                                v-model="formModel.address" />
                            <template v-if="errorList?.address">
                                <div class="invalid-feedback" v-for="(err, index) in errorList.address" :key="index">
                                    <span>{{ err }}</span>
                                </div>
                            </template>
                        </BCol>
                    </BRow>
                </BForm>
            </BCol>
        </BRow>
    </BModal>
</template>

<script>
import ImageCropper from "@/components/widgets/cropper";
import { useCustomerStore } from "@/state/pinia";
import {
    showSuccessToast,
    showErrorToast,
} from "@/helpers/alert.js";

var isOpenForm = ref(false);
var modalTitle = ref(false);
const customerStore = useCustomerStore();

const statusCode = computed(() => customerStore.error.status);
const errorList = computed(() => customerStore.error?.list || {});
const errorMessage = computed(() => customerStore.error?.message || "");
const maxFileSize = computed(() => customerStore.maxImageSize);

const imageUrl = ref("");
const croppedImageUrl = ref("");
const imageEdit = ref("")

const formModel = reactive({
    id: "",
    m_user_id: "",
    name: "",
    email: "",
    password: "",
    photo: "",
    phone: "",
    address: "",
});

const errorImageMessage = ref("");

export default {
    name: "CustomerForm",
    components: {
        ImageCropper,
    },

    props: {
        isOpenForm: Boolean,
        modalTitle: String,
        customer: Object
    },

    methods: {
        async saveCustomer() {
            try {
                if (formModel.id) {
                    await customerStore.updateCustomer(formModel);
                    if (statusCode.value != 200) {
                        showErrorToast("Failed to add customer", errorMessage.value);
                    } else {
                        closeModal();
                        await getCustomers(); // Refresh the customer list after deletion
                        showSuccessToast("Customer Edited successfully!");
                    }
                } else {
                    await customerStore.addCustomers(formModel);
                    if (statusCode.value != 200) {
                        showErrorToast("Failed to add customer", errorMessage.value);
                    } else {
                        closeModal();
                        await getCustomers(); // Refresh the customer list after deletion
                        showSuccessToast("Customer added successfully!");
                    }
                }
            } catch (error) {
                console.error(error);
                showErrorToast("Failed to add customer", errorMessage.value);
            }
        },
        closeModal() {
            this.$emit('update:isOpenForm', false);
        },
        clearEditImage() {
            imageEdit.value = ''
        },
        handleFileTooLarge(message) {
            if (message) {
                showErrorToast("Failed to add image", message);
                errorImageMessage.value = message;
            }
        }
    }
};
</script>

<style scoped lang="scss">
.image-cropper {
    text-align: center;
}

.cropper {
    max-width: 100%;
    margin-top: 20px;
}

.preview {
    border: 2px dashed var(--bs-border-color) !important;
    border-radius: 6px;
    margin-top: 20px;
}

.preview img {
    max-width: 100%;
}

.dropzone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 16px;
    background-color: #fff;
    transition: 0.3s ease all;
    height: 200px;

    label {
        padding: 8px 12px;
        font-size: 14p;
        color: #fff;
        color: #000;
        transition: 0.3s ease all;

        &::after {
            height: 0px;
        }
    }

    input {
        display: none;
    }
}

.active-dropzone {
    color: #fff;
    border-color: #fff;

    label {
        background-color: #fff;
    }
}

.delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>