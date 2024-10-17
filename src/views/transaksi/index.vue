<template>
  <Layout>
    <!-- Search and Select Section -->
    <div class="d-flex flex-row align-items-center g-3">
      <div class="me-3" style="width: 300px">
        <b-form-select
          v-model="selectedCustomer"
          :options="formattedOptions"
        ></b-form-select>
      </div>
      <div class="me-3" style="width: 300px">
        <b-form-input
          v-model="searchQuery"
          placeholder="Cari item"
          @input="getItems"
        ></b-form-input>
      </div>
      <div
        class="lap ms-auto"
        style="
          color: white;
          background-color: rgba(84, 109, 229, 255);
          border-radius: 3px;
          padding: 5px 10px;
        "
        @click="openReport"
      >
        <span>Laporan Penjualan</span>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="d-flex flex-column flex-md-row mt-4">
      <!-- Left column: Menu Items -->
      <div class="menu-items col-md-8">
        <div
          v-for="(item, index) in filteredItems"
          :key="index"
          class="menu-item text-center"
          @click="addItem(item)"
        >
          <img
            :src="item.imageUrl"
            alt="Item image"
            class="img-fluid"
            style="
              border-radius: 8px;
              width: 100%;
              height: 150px;
              object-fit: cover;
            "
          />
          <h6>{{ item.name }}</h6>
          <p>{{ formatCurrency(item.price) }}</p>
        </div>
      </div>

      <!-- Right column: Order Summary -->
      <div class="order-summary col-md-4 ms-md-3 mt-4 mt-md-0">
        <h5 class="mb-4">Detail Order</h5>
        <div class="customer-info">
          <h6>
            {{ selectedCustomer ? selectedCustomer.name : "Pilih customer" }}
          </h6>
        </div>

        <div v-if="orderItems.length" class="order-items">
          <div
            v-for="(order, index) in orderItems"
            :key="index"
            class="order-item d-flex align-items-center justify-content-between mb-3"
          >
            <div class="item-details d-flex align-items-center">
              <img
                :src="order.imageUrl"
                alt="Item image"
                style="
                  width: 50px;
                  height: 50px;
                  border-radius: 8px;
                  object-fit: cover;
                "
              />
              <div class="ms-2">
                <h6>{{ order.name }}</h6>
                <p>{{ formatCurrency(order.price) }}</p>
              </div>
            </div>
            <div class="item-quantity d-flex align-items-center">
              <button
                @click="decreaseItem(order)"
                class="btn btn-sm btn-outline-secondary"
              >
                -
              </button>
              <span class="mx-2">{{ order.quantity }}</span>
              <button
                @click="increaseItem(order)"
                class="btn btn-sm btn-outline-secondary"
              >
                +
              </button>
            </div>
          </div>

          <div class="order-summary-details">
            <div class="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="d-flex justify-content-between total">
              <span><strong>Total Pembayaran:</strong></span>
              <span
                ><strong>{{ formatCurrency(totalPrice) }}</strong></span
              >
            </div>
          </div>
        </div>

        <div v-else>
          <p>Keranjang kosong</p>
        </div>

        <button class="btn btn-primary w-100 mt-4" @click="submitOrder">
          + Tambah Pesanan
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import { ref, onMounted, computed } from "vue";
import { useTransaksiStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress";

import { useRouter } from "vue-router";
const router = useRouter();

const { startProgress, finishProgress, failProgress } = useProgress();
const TransaksiStore = useTransaksiStore();

const selectedCustomer = ref(null);
const searchQuery = ref("");
const orderItems = ref([]);

const getItems = () => {
  startProgress();
  TransaksiStore.updateSearchQuery(searchQuery.value);
  finishProgress();
};

const items = computed(() => TransaksiStore.products);

const formattedOptions = computed(() => {
  return [
    { value: null, text: "Pilih customer", disabled: true },
    ...TransaksiStore.customers.map((customer) => ({
      value: customer, // Pass the entire customer object
      text: customer.name, // Show customer name in the select dropdown
    })),
  ];
});

const formatCurrency = (value) => "Rp " + value.toLocaleString("id-ID");

const addItem = (item) => {
  const existingItem = orderItems.value.find(
    (order) => order.name === item.name
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    orderItems.value.push({ ...item, quantity: 1 });
  }
};

const increaseItem = (order) => {
  order.quantity++;
};

const decreaseItem = (order) => {
  if (order.quantity > 1) {
    order.quantity--;
  } else {
    orderItems.value = orderItems.value.filter((o) => o.name !== order.name);
  }
};

const subtotal = computed(() => {
  return orderItems.value.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );
});

const totalPrice = computed(() => subtotal.value);

const filteredItems = computed(() => {
  const searchTerm = searchQuery.value.toLowerCase();
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );
});

const submitOrder = async () => {
  try {
    startProgress();
    const customerId = selectedCustomer.value.id; // Get customer ID
    await TransaksiStore.addTransaction(customerId, orderItems.value); // Send orderItems as object
    finishProgress();
    orderItems.value = []; // Reset the cart after successful submission
  } catch (error) {
    failProgress();
    console.error("Failed to submit order:", error);
  }
};

const openReport = () => {
  router.push({ name: "laporan" });
};

onMounted(() => {
  startProgress();
  TransaksiStore.getCustomers();
  TransaksiStore.getProducts();
  finishProgress();
});
</script>

<style scoped>
.menu-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  height: auto;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  width: calc(25% - 10px);
  background-color: #fafafa;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  height: 250px;
}

.menu-item:hover {
  transform: translateY(-5px);
}

.menu-item p {
  color: #009aad;
  font-weight: 600;
}

.menu-item h6 {
  color: black;
}

.menu-item img {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 15px;
}

.image-placeholder {
  width: 100%;
  height: 150px;
  background-color: #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
}

.order-summary {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 550px;
  overflow-y: scroll;
}

.customer-info {
  margin-bottom: 15px;
  font-weight: bold;
}

.customer-info h6 {
  font-size: 27px;
  font-weight: 700;
  color: #546de4;
}

.order-item {
  border-bottom: 1px solid #e9ecef;
}

.order-item .item-image {
  width: 50px;
  height: 50px;
  background-color: #e9ecef;
  border-radius: 8px;
}

.order-summary-details {
  margin-top: 20px;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
}

button {
  cursor: pointer;
}

.lap {
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-item {
    width: calc(50% - 10px);
  }
}

@media (max-width: 576px) {
  .menu-item {
    width: 100%;
  }
}
</style>
