<script setup lang="ts">
import  Navbar from './components/Navbar.vue';
import Recipe from './views/Recipe.vue';

</script>

<template>
<Navbar></Navbar>
 <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
