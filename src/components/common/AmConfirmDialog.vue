<script setup>

import { ref } from 'vue'

const dialog = ref(false);
const resolve = ref(null);
const reject = ref(null);
const message = ref('');
const title = ref('');

function open(title, message) {
  dialog.value = true;
  title.value = title;
  message.value = message;
  return new Promise((resolve, reject) => {
    resolve.value = resolve;
    reject.value = reject;
  });
}

function agree() {
  resolve.value(true);
  dialog.value = false;
}

function cancel() {
  resolve.value(false);
  dialog.value = false;
}

</script>

<template>
  <template>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="290" @keydown.esc="cancel">
        <v-card>
          <v-card-title class="text-h5">
            {{title}}
          </v-card-title>
          <v-card-text>{{message}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green-darken-1" variant="text" @click="cancel">
              CANCEL
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="agree">
              SI
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
</template>

<style scoped>

</style>