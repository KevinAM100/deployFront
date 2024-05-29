<template>
  <v-data-table
    items-per-page-text="Elementos por página:"
    page-text="{0}-{1} de {2}"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'id', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title style="flex-grow: 3;">{{groupStore.carreraSel===null||groupStore.academicSel===null?"Selecciona una carrera y una gestión academica": 'Clases de ' + groupStore.carreraSel.name + ' ' + groupStore.academicSel.name+"/"+groupStore.academicSel.year}}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <create-classes-group-dialog @agregar="agregarElemento" :areaId="areaId" />
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        class="me-2"
        prepend-icon="mdi-pencil"
        variant="text"
        @click="editItem(item)"
      >
        Editar
      </v-btn>
      <v-btn size="small" prepend-icon="mdi-delete" variant="text" @click="deleteItem(item)">
        Eliminar
      </v-btn>
    </template>

    <template v-slot:item.horarios="{ item }">
      <SimpleListDivider :itemList="genHorarioString(item)" />
    </template>

    <template v-slot:item.aulas="{ item }">
      <SimpleListDivider :itemList="genAulaString(item)" />
    </template>

    <template v-slot:item.docentes="{ item }">
      <SimpleListDivider :itemList="genDocenteString(item)" />
    </template>

    <template v-slot:no-data>
      <p>No existen datos disponibles en este momento</p>
    </template>
  </v-data-table>

  <v-btn color="primary" variant="text" @click="generarDatosRedirect">
    Generar Clases desde itinerario</v-btn
  >
</template>

<script>
import SimpleListDivider from '@/components/app/SimpleListDivider.vue'
import CreateClassesGroupDialog from './CreateClassesGroupDialog.vue'
import UDate from '@/services/UDate'
import { useGroup } from '@/stores/admin/configgeneral/groupStore'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Nro',
        align: 'start',
        sortable: false,
        key: 'id'
      },
      { title: 'NOMNBRE ASIGNATURA', key: 'remark' },
      { title: 'GRUPO', key: 'groupIdentifier' },
      { title: 'HORARIO', key: 'horarios', sortable: false },
      { title: 'AULA', key: 'aulas', sortable: false },
      { title: 'DOCENTE ASIGNADO', key: 'docentes', sortable: false },
      { title: 'OPCIONES', key: 'actions', sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      curriculumId: 0,
      subjectId: 0,
      identifier: 'ID',
      remark: 'NA',
      listScheduleDto: []
    },
    defaultItem: {
      curriculumId: 0,
      subjectId: 0,
      identifier: 'ID',
      remark: 'NA',
      listScheduleDto: []
    }
  }),

  components: {
    CreateClassesGroupDialog,
    SimpleListDivider
  },

  props: {
    carrera: String,
    gestion: Number,
    areaId: Number,
    listData: Array
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

    listData: {
      handler: function (nuevo, oldVal) {
        this.desserts = nuevo  
      },
      deep: true
    }
  },

  created() {
    this.initialize()
  },

  setup() {
    const groupStore = useGroup()

    return {
      groupStore
    }
  },

  methods: {
    agregarElemento(elemento) {
      this.editedItem = elemento
      this.save()
    },

    genHorarioString(item) {
      let res = []
      for (let i = 0; i < item.listScheduleDto.length; i++) {
        let dia = item.listScheduleDto[i].dayOfWeek;
        res.push(
           UDate.getABDay(UDate.getDayEs(dia))+
            ' ' +
            UDate.getHourString(item.listScheduleDto[i].startTime) +
            ' - ' +
            UDate.getHourString(item.listScheduleDto[i].startTime)
        )
      }

      return res
    },

    genAulaString(item) {
      let res = []
      for (let i = 0; i < item.listScheduleDto.length; i++) {
        res.push(String(item.listScheduleDto[i].classroomName))
      }

      return res
    },

    genDocenteString(item) {
      let res = []
      for (let i = 0; i < item.listScheduleDto.length; i++) {
        res.push(String(item.listScheduleDto[i].professorFullName))
      }

      return res
    },

    generarDatosRedirect() {
      this.$router.push('manage-classes/generate')
    },

    initialize() {
      this.desserts = this.listData
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