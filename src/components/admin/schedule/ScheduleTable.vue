<template>
  <div>
    <v-container>

      <v-item-group multiple v-model="selectedDays">
        <v-row no-gutters>
          <v-col class="ma-1">
            <v-card variant="tonal" class="d-flex align-center">
              <div class="text-overline flex-grow-1 text-center">Horario</div>
            </v-card>
          </v-col>

          

          <v-col class="ma-1" v-for="(day, index) in diasTexto" :key="index">
            <v-item v-slot="{ isSelected, toggle }">
              <v-card
                :color="isSelected ? 'primary' : ''"
                class="d-flex align-center"
                dark
                @click="toggle"
              >
                <v-scroll-y-transition>
                  <div class="text-overline flex-grow-1 text-center">
                    {{ day }}
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>

      <v-responsive width="100%"></v-responsive>

      <v-item-group v-model="selectedPeriods" multiple>
        <v-row no-gutters v-for="k in rows" :key="k">
          <v-col class="ma-1">
            <v-card class="mx-auto" max-width="344" variant="elevated">
              <v-card-item>
                <div>
                  <div class="text-caption">
                    {{
                      filaHoras[k - 1][2]
                        ? filaHoras[k - 1][0] + ' a ' + filaHoras[k - 1][1]
                        : filaHoras[k - 1][0] + ' a ' + filaHoras[k - 1][1]
                    }}
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col class="ma-1" v-for="j in diasTexto.length" :key="j">
            <v-item v-if="filaHoras[k - 1][2]">
              <v-card
                :disabled="!habilitadoColumna(j - 1)"
                clickable
                class="mx-auto"
                max-width="344"
                variant="elevated"
                :color="isSelected ? 'primary' : ''"
              >
                <v-card-item>
                  <div>
                    <div class="text-caption">Almuerzo</div>
                  </div>
                </v-card-item>
              </v-card>
            </v-item>

            <v-item v-slot="{ isSelected, toggle }" v-else>
              <v-card
                :disabled="!habilitadoColumna(j - 1)"
                clickable
                class="mx-auto"
                max-width="344"
                variant="tonal"
                :color="isSelected ? 'primary' : ''"
                @click="toggle"
              >
                <v-card-item>
                  <div>
                    <div class="text-caption">{{ isSelected ? 'Activo' : 'No activo' }}</div>
                  </div>
                </v-card-item>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
  </div>
</template>
  
<script>
import { useScheduleStore } from '@/stores/admin/configgeneral/scheduleStore'
import { watch } from 'vue'

export default {
  setup() {
    const scheduleStore = useScheduleStore()
    /*watch(
      () => scheduleStore.valorIni,
      (newValue, oldValue) => {
        if (JSON.stringify(newValue) === JSON.stringify(scheduleStore.valorAct)) {
          this.selectedPeriods = scheduleStore.posItemsInitalSelected
        }
      }
    )

    watch(
      () => scheduleStore.valorAct,
      (newValue, oldValue) => {
        if (JSON.stringify(newValue) === JSON.stringify(scheduleStore.valorIni)) {
          this.selectedPeriods = scheduleStore.posItemsInitalSelected
        }
      }
    )*/

    return {
      scheduleStore
    }
  },

  created() {
    this.cambiosTablaPeriodos()
  },
  name: 'Horario',

  data() {
    return {
      diasTexto: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
      selectedDays: this.days,
      selectedPeriods: []
    }
  },

  methods: {
    valoresIguales() {
      return (
        JSON.stringify(this.scheduleStore.valorIni) === JSON.stringify(this.scheduleStore.valorAct)
      )
    },

    habilitadoColumna(col) {
      return this.selectedDays.includes(col)
    },

    cambiosTablaPeriodos() {
      if (this.valoresIguales()) {
        this.selectedPeriods = this.scheduleStore.posItemsInitalSelected
      } else {
      
        let dias = [0, 1, 2, 3, 4, 5, 6]

        for (let i = 0; i < dias.length; i++) {
          let columnaHabilitada = this.selectedDays.includes(dias[i])
          let colPos = dias[i]
          for (let k = 0; k < this.rows; k++) {
            if (columnaHabilitada) {
              let listaCopia = this.selectedPeriods
              listaCopia.push(colPos)
              listaCopia = Array.from(new Set(listaCopia))

              this.selectedPeriods = listaCopia
            } else {
              let listaCopia = this.selectedPeriods
              listaCopia = listaCopia.filter(function (valor) {
                return valor !== colPos
              })

              this.selectedPeriods = listaCopia
            }

            colPos = colPos + 7
          }
        }
      }
    }
  },

  watch: {
    selectedPeriods: {
      handler: function (nuevoVal, oldVal) {
        this.scheduleStore.setSelectedPeriods(nuevoVal)

        /*if(nuevoVal===this.scheduleStore.posItemsInitalSelected){
          this.scheduleStore.setEqualsValues(true);
        }else{
          this.scheduleStore.setEqualsValues(false);
        }*/
      },
      deep: true
    },
    selectedDays: {
      handler: function (nuevoSel, oldVal) {
        this.scheduleStore.setDays(nuevoSel)

        let res
        let columnaHabilitada
        if (nuevoSel.length > oldVal.length) {
          res = nuevoSel.filter(function (valor) {
            return !oldVal.includes(valor)
          })
          //agregado
          columnaHabilitada = true
        } else {
          res = oldVal.filter(function (valor) {
            return !nuevoSel.includes(valor)
          })

          //eliminado
          columnaHabilitada = false
        }

        let colPos = res[0]

        for (let k = 0; k < this.rows; k++) {
          if (columnaHabilitada) {
            let listaCopia = this.selectedPeriods
            listaCopia.push(colPos)
            listaCopia = Array.from(new Set(listaCopia))

            this.selectedPeriods = listaCopia
          } else {
            let listaCopia = this.selectedPeriods
            listaCopia = listaCopia.filter(function (valor) {
              return valor !== colPos
            })

            this.selectedPeriods = listaCopia
          }

          colPos = colPos + 7
        }
      },
      deep: true
    },

    rows: {
      handler: function (nuevoSel, oldVal) {
        this.cambiosTablaPeriodos()
      },
      deep: true
    }
  },

  props: {
    rows: Number,
    columns: Number,
    days: Array,
    filaHoras: Array
  }
}
</script>