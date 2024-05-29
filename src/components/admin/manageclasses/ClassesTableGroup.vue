<template>
  <v-data-table
    items-per-page-text="Elementos por página:"
    page-text="{0}-{1} de {2}"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'horaInicio', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Horarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <agree-group-c-lasses-dialog @agregarHorario="agregarElemento" />
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Está seguro que sea eliminar el horario?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
                >Eliminar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="deleteItem(item)" color="red">
        mdi-close-circle-outline
      </v-icon>
    </template>
    <template v-slot:item.maestro="{ item }">
      {{ item.professor ? item.professor.name : item.assistant ? item.assistant : 'Por Designar' }}
    </template>
    <template v-slot:no-data>
      <p>No existen datos disponibles en este momento</p>
    </template>
  </v-data-table>
</template>

<script>
import { useGroup } from '@/stores/admin/configgeneral/groupStore'
import AgreeGroupCLassesDialog from './AgreeGroupCLassesDialog.vue'

export default {
  data: () => ({
    dialogDelete: false,
    headers: [
      {
        title: 'Día',
        align: 'start',
        sortable: false,
        key: 'dayOfWeek'
      },
      { title: 'Horario Inicio', key: 'startTime' },
      { title: 'Horario Fin', key: 'endTime' },
      { title: 'Aula', key: 'classroom.name' },
      { title: 'Docente', key: 'maestro' },
      { title: 'Opción', key: 'actions', sortable: false }
    ],

    desserts: [],
    editedIndex: -1,

    editedItem: {
      curriculumId: 0,
      subjectId: 0,
      identifier: 'ID',
      remark: 'NA',
      listSchedule: []
    },

    defaultItem: {
      curriculumId: 0,
      subjectId: 0,
      identifier: 'ID',
      remark: 'NA',
      listSchedule: []
    }
  }),

  components: {
    AgreeGroupCLassesDialog
  },

  props: {
    carrera: String,
    gestion: Number,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },

    desserts: {
      handler: function (nuevo, oldVal) {
        this.groupStore.setListSchedule(nuevo);  
      },
      deep: true
    },
  },

  setup() {
    const groupStore = useGroup()

    return {
      groupStore
    }
  },

  methods: {
    agregarElemento(elemento) {
      if (this.isValidElemento(elemento)) {
        this.editedItem = elemento
        this.save()
      }
    },

    isValidElemento(elemento) {
      let valido = true
      if (
        elemento.cargo === 'Asistente' &&
        (elemento.assistant == null || elemento.assistant.length === 0)
      ) {
        valido = false
      }

      if(elemento.dayOfWeek.length===0||elemento.classroom===null){
        valido = false;
      }

      return valido;
    },

    generarDatosRedirect() {
      this.$router.push('manage-classes/generate')
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>