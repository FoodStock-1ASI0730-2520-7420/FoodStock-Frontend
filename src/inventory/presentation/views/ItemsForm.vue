<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({

  item: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'close']);

const localItem = ref({});

watch(() => props.item, (newItem) => {
  localItem.value = JSON.parse(JSON.stringify(newItem));
}, { immediate: true, deep: true });

function handleSubmit() {
  emit('submit', localItem.value);
}
</script>

<template>
  <div class="item-form-container">
    <form @submit.prevent="handleSubmit">
      <h4>{{ isEdit ? $t('items.edit') : $t('items.add') }}</h4>
      <div class="form-field">
        <label for="name">{{ $t('items.name') }}</label>
        <input id="name" type="text" v-model="localItem.name" required />
      </div>
      <div class="form-field">
        <label for="price">{{ $t('items.price') }}</label>
        <input id="price" type="number" step="0.01" v-model.number="localItem.price" required />
      </div>
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="cancel-button">{{ $t('items.cancel') }}</button>
        <button type="submit" class="submit-button">
          {{ isEdit ? $t('items.save') : $t('items.addItem') }}
        </button>
      </div>
    </form>
  </div>
</template>


<style scoped>
.item-form-container { padding: 10px; }
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