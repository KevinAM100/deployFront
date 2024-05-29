import { defineStore } from 'pinia'

export const useGenerateClasses = defineStore('myStore', {
  state: () => ({
    carreraSel: null,
    itineraroSel: null,
    academicSel: null,
  }),

  actions: {
    setDefaultInicial() {
      this.carreraSel = null
      this.itineraroSel = null
      this.academicSel = null
    },

    setCarrera(carrera) {
      this.carreraSel = carrera;
    },

    setItinerario(itinerario) {
      this.itineraroSel = itinerario;
    },

    setPeriodo(periodo) {
      this.academicSel = periodo;
    },

    isValidData() {
      let valido = false;
      if (this.academicSel !== null && this.carreraSel !== null && this.itineraroSel !== null) {
        valido = true;
      }
      return valido
    },
  }
})