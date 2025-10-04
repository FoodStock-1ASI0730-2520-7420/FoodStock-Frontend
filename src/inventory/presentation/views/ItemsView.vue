<script setup>
import { onMounted } from 'vue';
import { useInventoryStore } from '../../application/useInventoryStore';
// import { Item } from '../../domain/model/item.entity';


const store = useInventoryStore();


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
    <h2>Finished Dishes / Items Management</h2>
    <p>Total Items: {{ store.itemsCount }}</p>

    <button @click="console.log('Open Item Form')">Add New Item</button>

    <div v-if="store.errors.length" class="error-message">
      <p>Error loading items: {{ store.errors[0].message }}</p>
    </div>

    <table v-if="store.items.length">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in store.items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>${{ item.price.toFixed(2) }}</td>
        <td>
          <button @click="console.log('Edit Item', item.id)">Edit</button>
          <button @click="handleDeleteItem(item.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else-if="store.itemsLoaded">No items found.</p>
    <p v-else>Loading items...</p>
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
</style>