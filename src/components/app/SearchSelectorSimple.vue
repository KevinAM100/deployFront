<template>
  <v-autocomplete
    :label="label"
    v-model="item"
    :items="itemList"
    @input="seleccionarElemento"
  ></v-autocomplete>
</template>

<script>
export default {
  created() {
    this.recuperarLista()
  },

  data() {
    return {
      itemList: [],
      item: null
    }
  },

  methods: {
    recuperarLista() {
      let list = []
      for (let i = 0; i < this.lista.length; i++) {
        list.push(this.lista[i][this.name])
      }

      if (this.selectionRequired) {
        if (list.length > 0) {
          this.item = list[0]
          this.seleccionarElemento(0)
        }
      }
      this.itemList = list
    },

    seleccionarElemento() {
      const indice = this.itemList.findIndex((item) => item === this.item)
      if (indice !== -1) {
        this.$emit('guardarSel', this.lista[indice])
      }
    }
  },
  props: {
    lista: Array,
    selectionRequired: Boolean,
    name: String,
    label: String
  },

  watch: {
    lista: {
      handler: function (nuevo, oldVal) {
        this.item = null;
        this.recuperarLista()
      },
      deep: true
    },

    item: {
      handler: function (nuevo, oldVal) {
        this.seleccionarElemento()
      },
      deep: true
    }
  }
}
</script>