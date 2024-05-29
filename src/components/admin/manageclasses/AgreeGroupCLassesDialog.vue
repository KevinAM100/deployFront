<template>
  <v-row justify="end" class="me-3">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary darken-2" variant="elevated" prepend-icon="$plus" v-bind="props">
          Añadir
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Añadir Horario </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  label="Día *"
                  v-model="editedItem.dayOfWeek"
                  :items="diasList"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  label="Hora Inicio *"
                  model-value="12:30:00"
                  type="time"
                  suffix="hrs"
                  v-model="editedItem.startTime"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  label="Hora Fin *"
                  model-value="12:30:00"
                  type="time"
                  suffix="hrs"
                  v-model="editedItem.endTime"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-radio-group v-model="editedItem.cargo" inline>
                  <template v-slot:label>
                    <div>Seleccione una <strong>opción</strong></div>
                  </template>
                  <v-radio value="Docente">
                    <template v-slot:label>
                      <div>Docente</div>
                    </template>
                  </v-radio>
                  <v-radio value="Asistente">
                    <template v-slot:label>
                      <div>Asistente</div>
                    </template>
                  </v-radio>
                  <v-radio :value="null">
                    <template v-slot:label>
                      <div>Por designar</div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12">
                <search-selector-simple
                  label="Docente*"
                  name="name"
                  :lista="groupStore.listProfessor"
                  :selectionRequired="false"
                  @guardarSel="setDocente"
                  v-if="editedItem.cargo === 'Docente'"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Asistente"
                  type="String"
                  suffix=""
                  v-model="editedItem.assistant"
                  v-if="editedItem.cargo === 'Asistente'"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <search-selector-simple
                  label="Aula*"
                  name="name"
                  :lista="groupStore.listAulas"
                  :selectionRequired="false"
                  @guardarSel="setAula"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveData">Añadir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
  <script>

import UDate from '@/services/UDate'
import { useGroup } from '@/stores/admin/configgeneral/groupStore'
import SearchSelectorSimple from '@/components/app/SearchSelectorSimple.vue'

export default {
  components: { SearchSelectorSimple },

  created() {
    this.diasList = UDate.getListDayEs()
  },

  setup() {
    const groupStore = useGroup()

    return {
      groupStore
    }
  },

  data: () => ({
    editedItem: {
      dayOfWeek: '',
      startTime: '00:00',
      endTime: '00:00',
      professor: null,
      assistant: '',
      classroom: null,
      groupItineraryId: 1,
      cargo: 'Docente'
    },

    defaultItem: {
      dayOfWeek: '',
      startTime: '00:00',
      endTime: '00:00',
      professor: null,
      assistant: '',
      classroom: null,
      groupItineraryId: 1,
      cargo: 'Docente'
    },

    dialog: false,

    periodosList: [],
    diasList: [],
    docenteList: [],
    aulaList: [],

    periodosData: [],
    aulaData: []
  }),

  methods: {
    setDocente(professor) {
      this.editedItem.professor = professor
    },

    setAula(aula) {
      this.editedItem.classroom = aula
    },

    saveData() {
      if (this.editedItem.cargo === 'Docente') {
        this.editedItem.assistant = null
      } else if (this.editedItem.cargo === 'Asistente') {
        this.editedItem.professor = null
      } else if (this.editedItem.cargo === null) {
        this.editedItem.professor = null
        this.editedItem.assistant = null
      }

      this.$emit('agregarHorario', this.editedItem)
      this.editedItem = this.defaultItem
      this.dialog = false
    }
  }
}
</script>