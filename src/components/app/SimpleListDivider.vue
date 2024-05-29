<template>
    <div>
      <v-row v-for="(item, index) in itemList" :key="index">
        <v-col>{{ item }}</v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  export default {
    //<v-divider></v-divider>
    props: {
      itemList: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  