<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from 'v-viewer'
import { useCurriculumStore } from '@/stores/admin/configgeneral/curriculumStore'
import { useMainStore } from '@/stores/MainStore'

const mainStore = useMainStore()
const curriculumStore = useCurriculumStore()
const props = defineProps(['idCareer', 'idCurriculum'])
const html2Pdf = ref(null)
const imgCurriculum = ref(null)
var curriculum = null
var url = ''

const previewURL = async () => {
  await curriculumStore.getCurriculumByIdDetailed(
    mainStore.area.areaId,
    props.idCareer,
    props.idCurriculum
  )

  curriculum = await html2canvas(imgCurriculum.value).then((canvas) => {
    url = canvas.toDataURL()
  })

  const sourceImageURL = [{ src: url, alt: 'Malla curricular' }]
  const $viewer = viewerApi({
    images: sourceImageURL
  })
}
</script>

<template>
  <div ref="imgCurriculum" class="divCurriculum" v-if="curriculumStore.currentCurriculum != null">
    <h3 class="title-img-malla">
      Malla Curricular - {{ curriculumStore.currentCurriculum.careerName }}
    </h3>
    <v-row
      class="text-center row-principal"
      v-for="(level, index) in curriculumStore.currentCurriculum.levelDtoList"
      :key="index"
    >
      <v-card color="primary" variant="tonal" class="header-row">{{ level.levelName }}</v-card>
      <!--Card of subject--->
      <div class="row-cards">
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
      </div>
    </v-row>
  </div>
  <v-btn prepend-icon="mdi-file-download-outline" variant="text" @click="previewURL">
    Descargar Img
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

.header-row {
  display: flex;
  min-height: 112px;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 3px;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 50px;
}
.v-row {
  width: 80vw;
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

.row-cards {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0px;
  padding: 0px;
  width: 90%;
}

.row-principal {
  display: flex;
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
.divCurriculum {
  width: auto;
  padding: 5%;
  position: fixed;
  left: -999vw;
  top: 0;
  overflow: auto;
}
.title-img-malla {
  margin-bottom: 25px;
}
</style>
