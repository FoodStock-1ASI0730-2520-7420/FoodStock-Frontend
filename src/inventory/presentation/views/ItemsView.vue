<script setup>
import { onMounted, ref } from 'vue';
import { useInventoryStore } from '../../application/useInventoryStore';
import ItemForm from '../views/ItemsForm.vue';

const store = useInventoryStore();


const isModalVisible = ref(false);
const currentItem = ref({});
const isEditMode = ref(false);




function openAddItemModal() {
  isEditMode.value = false;
  currentItem.value = { id: null, name: '', price: 0.0 };
  isModalVisible.value = true;
}

function openEditItemModal(item) {
  isEditMode.value = true;
  currentItem.value = JSON.parse(JSON.stringify(item));
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
  currentItem.value = {};
}


const handleFormSubmit = async (formData) => {
  try {
    if (isEditMode.value) {

      await store.updateItem(formData);
      alert('Item updated successfully!');
    } else {
      // Lógica de ADICIÓN: Llama a la acción addItem del Store
      await store.addItem(formData);
      alert('Item added successfully!');
    }
    closeModal();
  } catch (error) {
    alert(`Error saving item: ${error.message}`);
  }
};


const handleDeleteItem = async (id) => {
  if (confirm(`Are you sure you want to delete Item with ID ${id}?`)) {
    try {
      await store.deleteItem(id);
      alert('Item deleted successfully!');
    } catch (error) {
      alert(`Error deleting item: ${error.message}`);
    }
  }
};


onMounted(() => {
  store.fetchItems();
});
</script>

<template>
  <div class="items-management">
    <h2>{{ $t('items.title') }}</h2>
    <p>{{ $t('items.total') }}: {{ store.items.length }}</p>

    <button @click="openAddItemModal">{{ $t('items.add') }}</button>

    <div v-if="store.errors.length && !store.itemsLoaded" class="error-message">
      <p>{{ $t('items.errorLoading') }}: {{ store.errors[0].message }}</p>
    </div>

    <table v-if="store.items.length">
      <thead>
      <tr>
        <th>ID</th>
        <th>{{ $t('items.name') }}</th>
        <th>{{ $t('items.price') }}</th>
        <th>{{ $t('items.actions') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in store.items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>${{ item.price ? item.price.toFixed(2) : '0.00' }}</td>
        <td>
          <button @click="openEditItemModal(item)">{{ $t('items.edit') }}</button>
          <button @click="handleDeleteItem(item.id)">{{ $t('items.delete') }}</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else-if="store.itemsLoaded">{{ $t('items.noItems') }}</p>
    <p v-else>{{ $t('items.loading') }}</p>
  </div>

  <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <ItemForm
          :item="currentItem"
          :is-edit="isEditMode"
          @submit="handleFormSubmit"
          @close="closeModal"
      />
    </div>
  </div>
</template>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.error-message {
  color: red;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #222;
  color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>