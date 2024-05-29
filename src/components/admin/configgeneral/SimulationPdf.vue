<script setup>
import Vue3Html2pdf from 'vue3-html2pdf'
import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useCurriculumStore } from '@/stores/admin/configgeneral/curriculumStore'
import { useMainStore } from '@/stores/MainStore'

const curriculumStore = useCurriculumStore()
const mainStore = useMainStore()
const props = defineProps(['idCareer', 'idCurriculum'])
const html2Pdf = ref(null)

const options = {
  margin: [10, 10, 10, 10],
  filename: 'Malla_Curricular.pdf',

  pagebreak: {
    mode: ['avoid-all', 'css'],
    avoid: 'v-col'
  },
  html2canvas: { scale: 2 },
  jsPDF: {
    orientation: 'l',
    compress: true
  }
}

const generateReport = async () => {
  await curriculumStore.getCurriculumByIdDetailed(
    mainStore.area.areaId,
    props.idCareer,
    props.idCurriculum
  )
  html2Pdf._value.generatePdf()
}
</script>

<template>
  <vue3-html2pdf
    :html-to-pdf-options="options"
    :show-layout="false"
    :float-layout="true"
    :enable-download="false"
    :preview-modal="true"
    :pdf-quality="3"
    :manual-pagination="true"
    filename="Malla_Curricular.pdf"
    pdf-format="legal"
    pdf-orientation="landscape"
    @hasGenerated="hasGenerated($event)"
    ref="html2Pdf"
    v-if="curriculumStore.currentCurriculum != null"
  >
    <template #pdf-content>
      <h3>Malla Curricular - {{ curriculumStore.currentCurriculum.careerName }}</h3>
      <v-row no-gutters style="width: 78vw">
        <v-col
          class="text-center"
          style="min-width: 102px"
          cols="auto"
          v-for="(level, index) in curriculumStore.currentCurriculum.levelDtoList"
          :key="index"
        >
          <v-card color="primary" variant="tonal" class="header">{{ level.levelName }}</v-card>
          <!--Card of subject--->
          <v-col class="col-cards">
            <v-card
              color="primary"
              variant="tonal"
              class="v-cards"
              v-for="(subject, index) in level.subjectCurriculumDetailedDtoList"
              :key="index"
            >
              <v-toolbar color="primary" height="25"
                ><v-spacer></v-spacer>{{ subject.subjectId }}<v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text> {{ subject.subjectName.slice(0, 41) }} </v-card-text>
              <div
                class="prerequisites"
                v-if="subject.path.split(',').length != 0 && subject.path.trim().length != 0"
              >
                <v-divider class="border-opacity-100" color="info"></v-divider>
                <v-chip
                  density="comfortable"
                  size="small"
                  color="primary"
                  variant="flat"
                  v-for="(prerequisite, index) in subject.path.split(',')"
                  :key="index"
                >
                  {{ prerequisite }}
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-col>
      </v-row>
    </template>
  </vue3-html2pdf>
  <v-btn prepend-icon="mdi-file-download-outline" variant="text" @click="generateReport()">
    Descargar pdf
  </v-btn>
</template>

 
 
<style>
h3 {
  margin: 8px;
}
.v-divider {
  height: 15px;
  margin: 0px;
  padding: 0%;
}
.header {
  margin: 8px 0%;
  padding: 8px 0px;
}

.v-col {
  margin: 5px;
  max-height: 700px;
  min-width: 102px;
}

.v-card-text {
  font-size: 12px;
  padding: 1px 2px;
}

.v-cards {
  height: 112px;
  width: 107px;
  margin-bottom: 10px;
  margin-right: 5px;
  position: relative;
}

.prerequisites {
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.col-cards {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
  height: 600px;
}

.title-row {
  width: 5%;
}

.v-chip__content {
  margin: 0px;
  padding: 0px;
}
.v-chip {
  padding: 0px;
}
</style>