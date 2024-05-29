
<template>
  <v-select v-model="almuerzoIni" :items="almuerzoIniItems" label="Hora Inicio"></v-select>
</template>
  <script>
export default {
  created() {
    this.inicializarItems()
  },

  props: {
    lista: Array,
    horaDefault: String,
  },

  methods: {
    setAlmuerzoSelect() {
      this.$emit("actualizarLunch", this.almuerzoIni);
    },

    getAlmuerzoItems(lista) {
      let res = []
      if (lista) {
        for (let i = 0; i < lista.length; i++) {
          res.push(lista[i][0])
        }
      }

      return res
    },

    inicializarItems() {
      let listaNueva = this.getAlmuerzoItems(this.lista)
      if (listaNueva.length > 0) {
        this.almuerzoIni = this.horaDefault
        this.almuerzoIniItems = listaNueva
      } else {
        this.almuerzoIni = this.horaDefault
        this.almuerzoIniItems = [this.horaDefault]
      }
    }
  },

  watch: {
    horaDefault: {
      handler: function (nuevo, oldVal) {
        this.inicializarItems()
      },
      deep: true
    },
    lista: {
      handler: function (nuevo, oldVal) {
        this.inicializarItems()
      },
      deep: true
    },

    almuerzoIni: {
      handler: function (nuevo, oldVal) {
        this.setAlmuerzoSelect();
      },
      deep: true
    }
  },

  data: () => ({
    almuerzoIni: null,
    almuerzoIniItems: []
  })
}
</script>

