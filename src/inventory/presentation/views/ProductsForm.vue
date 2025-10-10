<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { Select as PvSelect } from "primevue";

const props = defineProps({
  product: { type: Object, required: true },
  isEdit: { type: Boolean, default: false }
});


const categories = [
  { label: $t('categories.fruit'), value: 'fruit' },
  { label: $t('categories.vegetable'), value: 'vegetable' },
  { label: $t('categories.spices'), value: 'spices' },
  { label: $t('categories.proteins'), value: 'proteins' },
  { label: $t('categories.dairy'), value: 'dairy' }
];

const emit = defineEmits(['submit', 'close']);
const localProduct = ref({});

watch(() => props.product, (newProduct) => {
  localProduct.value = JSON.parse(JSON.stringify(newProduct));
}, { immediate: true, deep: true });

function handleSubmit() {
  emit('submit', localProduct.value);
}
</script>

<template>
  <div class="product-form-container">
    <form @submit.prevent="handleSubmit">
      <h4>{{ isEdit ? $t('products.edit') : $t('products.add') }}</h4>
      <div class="form-field">
        <label for="name">{{ $t('products.name') }}</label>
        <input id="name" type="text" v-model="localProduct.name" required />
      </div>
      <div class="form-field">
        <label for="unitPrice">{{ $t('products.unitPrice') }}</label>
        <input id="unitPrice" type="number" step="0.01" v-model.number="localProduct.unitPrice" required />
      </div>
      <div class="form-field">
        <label for="quantity">{{ $t('products.quantity') }}</label>
        <input id="quantity" type="number" v-model.number="localProduct.quantity" required />
      </div>
      <div class="form-field">
        <label for="expirationDate">{{ $t('products.expirationDate') }}</label>
        <input id="expirationDate" type="date" v-model="localProduct.expirationDate" />
      </div>
      <div class="form-field">
        <label for="category">{{ $t('products.category') }}</label>
        <pv-select
            id="category"
            v-model="localProduct.category"
            :options="categories"
            option-label="label"
            option-value="value"
            :placeholder="$t('products.category')"
        />
      </div>
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="cancel-button">{{ $t('products.cancel') }}</button>
        <button type="submit" class="submit-button">
          {{ isEdit ? $t('products.save') : $t('products.add') }}
        </button>
      </div>
    </form>
  </div>
</template>


<style scoped>
.product-form-container { padding: 10px; }
.form-field { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; color: #ccc; }
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background-color: #333;
  border: 1px solid #555;
  color: white;
}
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.submit-button { background-color: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;}
.cancel-button { background-color: #6c757d; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;}
</style>
