<template>
  <v-app>
    <v-main>
      <v-container>
        <HorarioForm/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useMainStore } from '@/stores/MainStore'
import HorarioForm from '../../../components/admin/schedule/SheduleForm.vue'
export default {
  name: 'MainHorario',
  components: {
    HorarioForm
  },
  setup() {
    const mainStore = useMainStore()
    return {
      areaData: mainStore.area
    }
  },
  data() {
    return {
      componentId: null
    }
  },
  methods: {
    changeId(nuevo) {
      this.componentId = toString(nuevo)
    }
  },
  watch: {
    areaData: {
      handler: function (nuevo, oldVal) {
        this.changeId(nuevo.areaId)
      },
      deep: true
    }
  }
}
</script>