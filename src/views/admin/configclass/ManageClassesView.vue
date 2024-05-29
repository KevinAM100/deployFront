<template>
  <v-card>
    <v-tabs v-model="selectedTab" color="primary">
      <v-tab to="/admin/manage-classes">CLASES POR GESTIÓN</v-tab>
      <v-tab to="/admin/manage-classes/generate">GENERAR CLASES</v-tab>
    </v-tabs>

    <v-card-text>
      <router-view></router-view>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: '/admin/manage-classes'
    }
  }
}
</script>
