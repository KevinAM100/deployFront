<script setup>
import { ref, onMounted } from 'vue';
const mode = ref(import.meta.env.MODE);
</script>

<template>
  <v-app-bar v-if="mode !== 'production'" class="v-app-customized" color="primary" dark>
      <span class="white--text v-app-customized" style="margin-left: auto; font-size: 20px;">
        <strong>Ambiente:</strong> {{ mode }}
      </span>
  </v-app-bar>
</template>

<style scoped>
.v-app-customized{
  margin-left: auto;
  margin-right: 20px;
  font-size: 20px;
}
</style>