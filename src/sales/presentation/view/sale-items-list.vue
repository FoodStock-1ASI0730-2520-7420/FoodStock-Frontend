<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useConfirm} from "primevue";
import {computed, onMounted} from "vue";
import useSalesStore from "../../application/sales.store.js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const saleId = Number(route.params.id);
const store = useSalesStore();
const { saleItems, sales, saleItemsLoaded, salesLoaded, errors, fetchSaleItems, fetchSales, deleteSale} = store;

onMounted(() => {
  if (!salesLoaded) fetchSales();
  if (!saleItemsLoaded) fetchSaleItems(saleId);
});

const filteredSaleItems = computed(() =>
    saleItems.filter(saleItem => saleItem.saleId === saleId));

const navigateToEdit = (id) => {
  console.log(id);
  router.push({ name: 'sale-edit', params: { id } });
};

const confirmDelete = (sale) => {
  confirm.require({
    message: t('sales.confirm-delete'),
    header: t('sales.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteSale(sale); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('saleItems.title') }}</h1>
    <pv-data-table
        :value="filteredSaleItems"
        :loading="!saleItemsLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="6"
        :rows-per-page-options="[5, 10, 20]"
    >
      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" :header="t('saleItems.name')" />
      <pv-column field="priceUnit" :header="t('saleItems.priceUnit')" sortable/>
      <pv-column field="quantity" :header="t('saleItems.quantity')" sortable />
      <pv-column field="subtotal" :header="t('saleItems.subtotal')" sortable />
    </pv-data-table>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
    <pv-confirm-dialog />
  </div>
</template>

<style scoped>

</style>