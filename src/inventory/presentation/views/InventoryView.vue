<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div>
    <h2>{{ $t('inventory.title') }}</h2>
    <button @click="router.push('/inventory/items')">{{ $t('inventory.viewItems') }}</button>
    <button @click="router.push('/inventory/products')">{{ $t('inventory.viewProducts') }}</button>
    <router-view />
  </div>
</template>
