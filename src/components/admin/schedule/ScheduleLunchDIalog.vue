<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" variant="tonal" prepend-icon="$plus">Agregar</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar almuerzo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <ScheduleLunch
                  :horaDefault="horaDefault"
                  :lista="lista"
                  @actualizarLunch="setAlmuerzoSel"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Minutos"
                  v-model.number="minutosAlmuerzo"
                  type="number"
                  suffix="Minutos"
                ></v-text-field>
              </v-col>
              
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Cancelar </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="setAlmuerzoSelect"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
  <script>
import ScheduleLunch from './ScheduleLunch.vue'

export default {
  data: () => ({
    dialog: false,
    minutosAlmuerzo: null,
    almuerzoIni: null
  }),
  props: {
    lista: Array,
    horaDefault: String
  },

  methods: {
    setAlmuerzoSelect() {
      if(this.minutosAlmuerzo&&this.almuerzoIni){
        this.$emit("actualizarDatosLunch", this.almuerzoIni, this.minutosAlmuerzo);
      }else{
        this.$emit("actualizarDatosLunch", null, 0);
      }

      this.dialog = false
    },

    setAlmuerzoSel(horaIni) {
      this.almuerzoIni = horaIni;
    }
  },
  components: { ScheduleLunch }
}
</script>