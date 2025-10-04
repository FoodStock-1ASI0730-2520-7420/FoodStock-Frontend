<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import useSalesStore from "../../application/sales.store.js";
import {Sale} from "../../domain/model/sale.entity.js";
import {Button as PvButton, InputNumber as PvInputNumber, InputText as PvInputText, Select as PvSelect} from "primevue";
import {SaleItem} from "../../domain/model/saleItem.entity.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSalesStore();
const {errors, sales, salesLoaded, addSale, updateSale, fetchSales} = store;

const saleType = [
  { label: "In-Person", value: 'in-person' },
  { label: "Delivery", value: 'delivery' }
]

const paymentMethods = [
  { label: "Cash", value: 'cash' },
  { label: "Card", value: 'card' },
  { label: "Transfer", value: 'transfer' }
]

const form = ref({saleType: '', paymentMethod: '', waiter: '', saleItems: []});
const isEdit = computed(() => !!route.params.id);

const saleItemForm = ref({name: '', priceUnit: 0, quantity: 1});

onMounted(() => {
  if (!salesLoaded) fetchSales();
  if (isEdit.value) {
    const sale = getSaleById(route.params.id);
    if (sale) {
      Object.assign(form.value, sale);
    } else router.push({name: 'sales-list'});
  }
});

const totalFinal = computed(() => {
  const saleItems = form.value.saleItems.map(item => new SaleItem(item))
  console.log('saleItems', saleItems);
  const sale = new Sale({...form.value, saleItems})
  return sale.totalCount;
})

function getSaleById(id) {
  return store.getSaleById(id);
}

const saveSale = async () => {
  const saleItemsData = form.value.saleItems.map(item => {
    const saleItem = new SaleItem(item)
    return {
      name: saleItem.name,
      priceUnit: saleItem.priceUnit,
      quantity: saleItem.quantity,
      subtotal: saleItem.subtotal};
  })
  const sale = new Sale({
    id: isEdit.value ? route.params.id : null,
    saleType: form.value.saleType,
    paymentMethod: form.value.paymentMethod,
    waiter: form.value.waiter
  });
  const { saleItems, ...saleToSave} = { ...sale};
  saleToSave.total = saleItemsData.reduce((sum, item) => sum + item.subtotal, 0);

  let saleId;

  if (isEdit.value) {
    await store.updateSale(saleToSave);
    saleId = saleToSave.id;
  } else {
    console.log('venta a guardar:', saleToSave);
    const saleResponse = await addSale(saleToSave);
    saleId = saleResponse.data.id;
  }

  for (const item of saleItemsData) {
    await store.addSaleItem({
      ...item,
      saleId
    });
  }
  navigateBack();
};

const addSaleItem = () => {
  form.value.saleItems.push({ ...saleItemForm.value})
  saleItemForm.value = { name: '', priceUnit: 0, quantity: 1};
}

const removeSaleItem = (index) => {
  form.value.saleItems.splice(index, 1);
}

const navigateBack = () => {
  router.push({name: 'sales-list'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sale.edit-title') : t('sale.new-title') }}</h1>
    <form @submit.prevent="saveSale">
      <div class="field mb-3">
        <label for="saleType">{{ t('sale.saleType') }}</label>
        <pv-select
            id="saleType"
            v-model="form.saleType"
            :options="saleType"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a type of sale"
            class="w-full"
        />
      </div>
      <div class="field mb-3">
        <label for="paymentMethod">{{ t('sale.paymentMethod') }}</label>
        <pv-select
            id="paymentMethod"
            v-model="form.paymentMethod"
            :options="paymentMethods"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a payment method"
            class="w-full"
        />
      </div>
      <div class="field mb-3">
        <label for="waiter">{{ t('sale.waiter') }}</label>
        <pv-input-text id="waiter" v-model="form.waiter" class="w-full" />
      </div>

      <div class="mb-4">
        <h2>{{ t('sale.addItem')}}</h2>
          <div class="field mb-2">
            <label for="name">{{ t('sale.name') }}</label>
            <pv-input-text id="name" v-model="saleItemForm.name" class="w-full" />
          </div>
          <div class="field mb-2">
            <label for="price">{{ t('sale.price') }}</label>
            <pv-input-number id="price" v-model="saleItemForm.priceUnit" class="w-full" />
          </div>
          <div class="field mb-2">
            <label for="quantity">{{ t('sale.quantity') }}</label>
            <pv-input-number id="quantity" v-model="saleItemForm.quantity" class="w-full" />
          </div>
        <pv-button type="button" :label="t('sale.addItem')" icon="pi pi-plus" @click="addSaleItem"></pv-button>
        </div>
      <div v-if="form.saleItems.length">
        <h3>{{ t('sale.itemList')}}</h3>
        <ul>
          <li v-for="(item, index) in form.saleItems" :key="index" class="mb-2 border p-2 rounded">
            {{ item.name}} - {{ new SaleItem(item).subtotal}}
            <pv-button type="button" icon="pi pi-trash" severity="danger" @click="removeSaleItem(index)"></pv-button>
          </li>
        </ul>
      </div>
      <div class="field mb-3">
        <label>{{ t('sale.total')}}</label>
        <span class="font-bold">{{ totalFinal}}</span>
      </div>
      <pv-button type="submit" :label="t('sale.save')" icon="pi pi-save" />
      <pv-button :label="t('sale.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>