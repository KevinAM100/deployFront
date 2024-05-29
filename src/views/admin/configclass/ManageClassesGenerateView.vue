<template>
  <v-container v-if="!isEscribiendo">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6">
            <search-selector-simple
              label="Carrera"
              name="name"
              :lista="carreras"
              :selectionRequired="false"
              @guardarSel="generateStore.setCarrera"
            />
          </v-col>
          <v-col cols="12" md="6">
            <search-selector-simple
              label="Gestion Academica"
              name="name"
              :lista="academicPeriods"
              :selectionRequired="false"
              @guardarSel="generateStore.setPeriodo"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6">
            <search-selector-simple
              label="Itinerario"
              name="name"
              :lista="listaItinerarios"
              :selectionRequired="false"
              @guardarSel="generateStore.setItinerario"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn color="primary darken-2" variant="elevated" @click="generarDatosBD">GENERAR CLASES</v-btn>
    </v-row>
    <v-row justify="end">
      <toast-simple
        :mostrar="alertaOpciones.isMostrando"
        :mensaje="alertaOpciones.mensaje"
        :error="alertaOpciones.isError"
        @cerrar="cerrarAlerta"
      />
    </v-row>
  </v-container>

  <v-container v-else>
    <loading-generate />
  </v-container>
</template>

<script>
import LoadingGenerate from '@/components/admin/manageclasses/LoadingGenerate.vue'
import SearchSelectorSimple from '@/components/app/SearchSelectorSimple.vue'
import { useMainStore } from '@/stores/MainStore'
import { ref, watch } from 'vue'
import { useCareerStore } from '@/stores/admin/configgeneral/careerStore'
import { onMounted } from 'vue'
import { useAcademicPeriodStore } from '@/stores/admin/configgeneral/academicPeriodStore'
import { useItineraryReadStore } from '@/stores/admin/configgeneral/itineraryReadStore'
import ToastSimple from '@/components/app/ToastSimple.vue'
import { useGenerateClasses } from '@/stores/admin/configgeneral/generateClassesStore'
import AxiosAM from '@/services/AxiosAM'

export default {
  components: {
    LoadingGenerate,
    SearchSelectorSimple,
    ToastSimple
  },

  setup() {
    const mainStore = useMainStore()
    const area = ref(mainStore.area)

    const carreras = ref([])
    const careerStore = useCareerStore()

    const academicPeriods = ref([])
    const academicStore = useAcademicPeriodStore()

    const listaItinerarios = ref([])
    const itinerarioStore = useItineraryReadStore()

    const generateStore = useGenerateClasses()

    watch(
      () => mainStore.area.areaId,
      async (newAreaId) => {
        if (newAreaId !== null) {
          await leerDatos(newAreaId)
        }
      }
    )

    watch(
      () => careerStore.careers,
      (newCareers) => {
        carreras.value = newCareers
      }
    )

    watch(
      () => itinerarioStore.itineraries,
      (newCareers) => {
        listaItinerarios.value = newCareers
      }
    )

    watch(
      () => academicStore.academicPeriods,
      (newCareers) => {
        academicPeriods.value = newCareers
      }
    )

    watch(mainStore.area, (newValue) => {
      area.value = newValue
    })

    
    onMounted(async () => {
      if (area.value.areaId !== null) {
        await leerDatos(area.value.areaId)
      }
    })

    async function leerDatos(area) {
      generateStore.setDefaultInicial()

      await careerStore.getCareers(area)
      await itinerarioStore.getItineraries(area)
      await academicStore.listAcademicPeriodByArea(area)
    }

    return {
      area,
      carreras,
      listaItinerarios,
      academicPeriods,
      generateStore
    }
  },
  data: () => ({
    isEscribiendo: false,
    alertaOpciones: {
      isMostrando: false,
      mensaje: '',
      isError: false
    }
  }),
  methods: {
    cerrarAlerta() {
      this.alertaOpciones = {
        isMostrando: false,
        mensaje: '',
        isError: false
      }
    },

    generarDatosBD() {

      if (this.area.areaId !== null && this.area.areaId !== undefined) {
        if (this.generateStore.isValidData()) {
          let direccion = `/admin/areas/${this.area.areaId}/careers/${this.generateStore.carreraSel.id}/academic-periods/${this.generateStore.academicSel.id}/groups/bulk-create-groups?itineraryId=${this.generateStore.itineraroSel.id}`
          
          this.isEscribiendo = true

          AxiosAM.post(direccion, null)
            .then((respuesta) => {

              this.alertaOpciones = {
                isMostrando: true,
                mensaje: 'Cambios registrados correctamente.',
                isError: false
              }

              this.isEscribiendo = false;
            })
            .catch((error) => {

              this.alertaOpciones = {
                isMostrando: true,
                mensaje: 'Error al enviar la solicitud al servidor.',
                isError: true
              }

              this.isEscribiendo = false;
            })
        } else {
          this.alertaOpciones = {
            isMostrando: true,
            mensaje: 'Rellena todos los campos.',
            isError: true
          }
        }
      } else {
        this.alertaOpciones = {
          isMostrando: true,
          mensaje: 'Selecciona un área.',
          isError: true
        }
      }

      this.generateStore.setDefaultInicial();

    }
  },

}
</script>
