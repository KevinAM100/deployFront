<template>
  <v-app>
    <v-main>

      <v-container v-if="areaSel">
        <div class="mb-4">
          <v-alert
            v-model="alert"
            variant="tonal"
            closable
            close-label="Close Alert"
            :color="colorAlert"
          >
            {{ mensajeAlert }}
          </v-alert>
        </div>

        <v-row class="justify-end p-2">
          <v-btn variant="outlined" class="mr-2" @click="recuperarParametros"> Descartar </v-btn>
          <v-btn
            variant="elevated"
            class="mr-2"
            :disabled="scheduleStore.isEqualsValue"
            @click="cambiarParametros"
            color="primary"
          >
            Guardar
          </v-btn>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <v-card title="Parámetros" variant="outlined" color="indigo-darken-3">
              <v-card-item>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Hora Inicio"
                      model-value="12:30:00"
                      type="time"
                      suffix=""
                      v-model="horainicio"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Hora Fin"
                      model-value="12:30:00"
                      type="time"
                      suffix=""
                      v-model="horafin"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Intervalo de tiempo"
                      v-model.number="minutosper"
                      type="number"
                      suffix="Minutos"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Entre Periodos"
                      v-model.number="entrePer"
                      type="number"
                      suffix="Minutos"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined" color="indigo-darken-3">
              <v-card-title> Almuerzo </v-card-title>
              <v-card-text v-if="isAlmuerzo">
                {{ itemAlmuerzo[0] }} a {{ itemAlmuerzo[1] }}
              </v-card-text>

              <v-card-text v-else> Sin agregar </v-card-text>

              <v-card-actions>
                <ScheduleLunchDialog
                  v-if="!isAlmuerzo"
                  :horaDefault="almuerzoIni"
                  :lista="filaHoras"
                  @actualizarDatosLunch="agregarAlmuerzo"
                />
                <v-row v-else justify="center">
                  <v-btn class="ma-2" color="red" variant="tonal" @click="cancelarAlmuerzo">
                    Descartar
                    <v-icon end icon="mdi-cancel"></v-icon>
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" v-if="cargandoDatos">
            <v-skeleton-loader class="mx-auto" elevation="12" type="table-heading, table-tbody">
            </v-skeleton-loader>
          </v-col>

          <HorarioGrafico
            v-else
            :horaini="horainicio"
            :horafin="horafin"
            :minutosper="minutosper"
            :listaDias="days"
            :filas="filas"
            :filaHoras="filaHoras"
          />
        </v-row>
      </v-container>

      <v-container v-else>
        Ninguna Area Seleccionada
      </v-container>
    </v-main>
  </v-app>
</template>
    
    <script>
import HorarioGrafico from './ScheduleGraphic.vue'
import ScheduleLunchDialog from './ScheduleLunchDIalog.vue'

import AxiosAM from '@/services/AxiosAM'
import { useScheduleStore } from '@/stores/admin/configgeneral/scheduleStore'
import { useMainStore } from '@/stores/MainStore'
import { ref, watch } from 'vue'


export default {

  setup() {
    const scheduleStore = useScheduleStore()

    function cambiarValor1(valor1) {
      scheduleStore.setValor1(valor1)
    }

    function cambiarValor2(valor2) {
      scheduleStore.setValor2(valor2)
    }

    const mainStore = useMainStore();

    return {
      scheduleStore,
      cambiarValor1,
      cambiarValor2,

      areaData: mainStore.area,
    }
  },

  key: function() {
    return this.areaId;
  },


  editarDatosActuales() {
    this.cambiarParametros()
  },

  descartarCambios() {
    this.recuperarParametros()
  },

  created() {
    //this.recuperarParametros()
    this.verificarAreaSel(this.areaData)
  },
  name: 'HorarioForm',
  components: {
    HorarioGrafico,
    ScheduleLunchDialog
  },
  data() {
    return {
      areaSel: false,
      areaId: 0,
      postListSelecInital: [],
      alert: false,
      colorAlert: '',
      mensajeAlert: '',
      cargandoDatos: false,
      timerCargando: null,
      dialog: false,
      horainicio: '00:00',
      horafin: '00:00',
      minutosper: 0,
      entrePer: 0,
      days: [false, false, false, false, false, false, false],
      filas: 0,
      filaHoras: [],

      isAlmuerzo: false,
      almuerzoIni: null,
      minutosAlmuerzo: 0,
      itemAlmuerzo: [],

      initialValues: {
        horainicio: '00:00',
        horafin: '00:00',
        minutosper: 0,
        days: [false, false, false, false, false, false, false]
      }
    }
  },

  methods: {

    cancelarAlmuerzo() {
      /*let valor = null
      for (let i = 0; i < this.filaHoras.length; i++) {
        if (this.filaHoras[i][2] === true) {
          valor = this.filaHoras[i]
        }
      }

      if (valor !== null) {
        if (JSON.stringify(this.itemAlmuerzo) !== JSON.stringify(valor)) {
          this.isAlmuerzo = false
          this.almuerzoIni = null
          this.minutosAlmuerzo = 0
          this.itemAlmuerzo = [null, null, false]
        }
      }*/

      this.isAlmuerzo = false
      this.almuerzoIni = null
      this.minutosAlmuerzo = 0
      this.itemAlmuerzo = [null, null, false]
    },

    cancelarAlmuerzoVerificacion() {
      let valor = null
      for (let i = 0; i < this.filaHoras.length; i++) {
        if (this.filaHoras[i][2] === true) {
          valor = this.filaHoras[i]
        }
      }

      if (valor !== null) {
        if (JSON.stringify(this.itemAlmuerzo) !== JSON.stringify(valor)) {
          this.isAlmuerzo = false
          this.almuerzoIni = null
          this.minutosAlmuerzo = 0
          this.itemAlmuerzo = [null, null, false]
        }
      } else {
        this.isAlmuerzo = false
        this.almuerzoIni = null
        this.minutosAlmuerzo = 0
        this.itemAlmuerzo = [null, null, false]
      }

      /*this.isAlmuerzo = false
          this.almuerzoIni = null
          this.minutosAlmuerzo = 0
          this.itemAlmuerzo = [null, null, false]*/
    },

    agregarAlmuerzo(iniLunch, minutos) {
      if (iniLunch && minutos > 0) {
        this.almuerzoIni = iniLunch
        this.minutosAlmuerzo = minutos
        this.isAlmuerzo = true
      } else {
        this.almuerzoIni = null
        this.minutosAlmuerzo = 0
        //this.itemAlmuerzo = [null, null, false]
        this.isAlmuerzo = false
      }
    },

    async recuperarParametros() {
      

      try {
        let datos = await AxiosAM.get('admin/schedule-parameters/' + this.areaId)

        let valores = datos.data

        this.horainicio =
          this.fHora(valores.startTimeSchedule[0]) + ':' + this.fHora(valores.startTimeSchedule[1])
        this.horafin =
          this.fHora(valores.endTimeSchedule[0]) + ':' + this.fHora(valores.endTimeSchedule[1])
        this.minutosper = valores.timeIntervalSchedule
        this.days = [
          valores.mondaySchedule,
          valores.tuesdaySchedule,
          valores.wednesdaySchedule,
          valores.thursdaySchedule,
          valores.fridaySchedule,
          valores.saturdaySchedule,
          valores.sundaySchedule
        ]
        this.entrePer = valores.betweenPeriod

        this.isAlmuerzo = valores.lunchTimeSchedule

        this.scheduleStore.setStartTime(this.horainicio)
        this.scheduleStore.setEndTime(this.horafin)
        this.scheduleStore.setDaysBool(this.days)
        this.scheduleStore.setTimeInterval(this.minutosper)
        this.scheduleStore.setBetweenPeriod(valores.betweenPeriod)

        if (valores.endLunchTimeSchedule != null && valores.startLunchTimeSchedule != null) {
          let minutosIni = this.hourToMinutes(this.timeToStringData(valores.startLunchTimeSchedule))
          let minutosFin = this.hourToMinutes(this.timeToStringData(valores.endLunchTimeSchedule))
          let diferencia = minutosFin - minutosIni

          this.minutosAlmuerzo = diferencia
          this.almuerzoIni = this.timeToStringData(valores.startLunchTimeSchedule)

          this.itemAlmuerzo = [
            this.timeToStringData(valores.startLunchTimeSchedule),
            this.timeToStringData(valores.endLunchTimeSchedule),
            true
          ]
          this.isAlmuerzo = true

          this.scheduleStore.setLunch(
            this.timeToStringData(valores.startLunchTimeSchedule),
            this.timeToStringData(valores.endLunchTimeSchedule),
            valores.lunchTimeSchedule
          )
        } else {
          this.minutosAlmuerzo = 0
          this.almuerzoIni = null
          this.isAlmuerzo = false
        }

        this.scheduleStore.setValorIni(valores)
      } catch (error) {
        console.error('Error getting schedules', error)
      }

      try {
        let datos = await AxiosAM.get('admin/schedule-periods/' + this.areaId)

        let valores = datos.data

        let diasSel = this.scheduleStore.daysItemsSelected
        let diasString = this.scheduleStore.daysListString
        let periodsSel = this.scheduleStore.periodsActive

        let listaSelIniPos = []

        for (let j = 0; j < diasSel.length; j++) {
          //let k = 0

          for (let i = 0; i < this.filaHoras.length; i++) {
            let valorAct = 7 * i + diasSel[j]

            let valor = {
              startTime: this.filaHoras[i][0],
              endTime: this.filaHoras[i][1],
              weekday: diasString[j],
              active: true,
              areaId: this.areaId
            }

            if (this.filaHoras[i][2] === false) {
              for (let k = 0; k < valores.length; k++) {
                let horaIni = this.timeToStringData(valores[k].startTime);
                let horaFin = this.timeToStringData(valores[k].endTime);

                if(valor.startTime === horaIni&&valor.endTime===horaFin&&valor.weekday===valores[k].weekday){
                  listaSelIniPos.push(valorAct)
                }
              }
            }
          }
        }

        this.postListSelecInital = listaSelIniPos;
        this.scheduleStore.setPosItemsInitalSelected(listaSelIniPos);

      } catch (error) {
        console.error('Error getting schedules', error)
      }
    },

    async cambiarParametros() {
      

      let exitoso = false
      try {
        await AxiosAM.put('admin/schedule-parameters/' + this.areaId, this.scheduleStore.valorAct)

        exitoso = true
      } catch (error) {
        console.error('Error getting schedules', error)
        exitoso = false
      }

      let exitoEliminacion = false
      try {
        await AxiosAM.delete('admin/schedule-periods/delete-by-area/' + this.areaId)
        exitoEliminacion = true
      } catch (error) {
        exitoEliminacion = false
      }

      let exitoAgregacion = true

      let diasSel = this.scheduleStore.daysItemsSelected
      let diasString = this.scheduleStore.daysListString
      let periodsSel = this.scheduleStore.periodsActive

      for (let j = 0; j < diasSel.length; j++) {
        //let k = 0

        for (let i = 0; i < this.filaHoras.length; i++) {
          let valorAct = 7 * i + diasSel[j]
          if (periodsSel.includes(valorAct)) {
            try {
              let valor = {
                startTime: this.filaHoras[i][0],
                endTime: this.filaHoras[i][1],
                weekday: diasString[j],
                active: true,
                areaId: this.areaId
              }

              if (
                valor.startTime !== this.scheduleStore.valorAct.startLunchTimeSchedule &&
                valor.endTime !== this.scheduleStore.valorAct.endLunchTimeSchedule
              ) {
                await AxiosAM.post('admin/schedule-periods', valor)
                //k = k + 1
              }
            } catch (error) {
              console.error('Error getting schedules', error)
              exitoAgregacion = false
            }
          }
        }
      }

      this.alert = exitoso
      if (exitoso === true && exitoEliminacion === true && exitoAgregacion === true) {
        this.colorAlert = 'success'
        this.mensajeAlert = 'Cambios guardados correctamente.'
        this.alert = true

        setTimeout(() => {
          this.alert = false
          this.scheduleStore.isEqualsValue = true
        }, 2000)
      } else {
        this.colorAlert = 'error'
        this.mensajeAlert =
          'Ocurrió un error, algo salio mal: ' +
          (exitoso === false ? 'Error al guardar los parámetros, ' : '') +
          (exitoEliminacion === false ? 'Error al eliminar periodos, ' : '') +
          (exitoAgregacion === false ? 'Error al agregar periodos, ' : '')

        this.alert = true
        setTimeout(() => {
          this.alert = false
          this.scheduleStore.isEqualsValue = true
        }, 2000)
      }

      this.recuperarParametros()
    },

    fHora(numero) {
      return numero < 10 ? '0' + numero : numero
    },

    hourToMinutes(texto) {
      let minListIni = texto.split(':')
      return parseInt(minListIni[0]) * 60 + parseInt(minListIni[1])
    },

    timeToStringData(data) {
      let res = null
      if (data) {
        res = this.fHora(data[0]) + ':' + this.fHora(data[1])
      }

      return res
    },

    timeToString(hour, minutes) {
      let res = null
      if (hour != null && minutes != null) {
        res = this.fHora(hour) + ':' + this.fHora(minutes)
      }
      return res
    },

    minutesToHour(minutes) {
      let horas = parseInt(minutes / 60)
      let minutos = parseInt(minutes % 60)

      return this.timeToString(horas, minutos)
    },

    actualizarDias(dias) {
      this.days = dias
    },

    cambiarCantPer() {
      if (this.timerCargando !== null) {
        clearTimeout(this.timerCargando)
      }

      this.cargandoDatos = true

      let minutosIni = this.hourToMinutes(this.horainicio)
      let minutosFin = this.hourToMinutes(this.horafin)

      let diferencia = minutosFin - minutosIni

      if (diferencia > 0 && this.minutosper > 0) {
        if (diferencia >= this.minutosper) {
          let filaHoraAux = []
          let cont = minutosIni

          let filasCont = 0
          let cumpleHoraFin = true

          while (cumpleHoraFin) {
            let horaIniString = this.minutesToHour(cont)
            let horaFinString
            let isItemAlmuerzo
            let contFinAux

            if (horaIniString !== this.almuerzoIni) {
              contFinAux = cont + this.minutosper
              horaFinString = this.minutesToHour(contFinAux)
              isItemAlmuerzo = false

              cont = cont + this.minutosper
            } else {
              isItemAlmuerzo = true

              if (this.minutosAlmuerzo > 0) {
                contFinAux = cont + this.minutosAlmuerzo
                horaFinString = this.minutesToHour(contFinAux)
                cont = cont + this.minutosAlmuerzo
              } else {
                contFinAux = cont + this.minutosper
                horaFinString = this.minutesToHour(contFinAux)
                isItemAlmuerzo = false

                cont = cont + this.minutosper
              }
            }

            cumpleHoraFin = contFinAux <= minutosFin

            if (cumpleHoraFin) {
              filaHoraAux.push([horaIniString, horaFinString, isItemAlmuerzo])
              if (isItemAlmuerzo) {
                this.itemAlmuerzo = [horaIniString, horaFinString, isItemAlmuerzo]
              }

              if (this.entrePer > 0) {
                cont = cont + this.entrePer
              }

              filasCont = filasCont + 1
            }
          }

          this.filaHoras = filaHoraAux
          this.filas = filasCont

          this.timerCargando = setTimeout(() => {
            this.cargandoDatos = false
          }, 1000)
        } else {
          this.filas = 0
          this.filaHoras = []

          this.cargandoDatos = false
        }
      } else {
        this.filas = 0
        this.filaHoras = []

        this.cargandoDatos = false
      }
    },

    verificarAreaSel(nuevo){
      if(nuevo!==null){
          if(nuevo.areaId!==null){
            console.log("nuevaArea"+nuevo.areaId);

            this.areaId = nuevo.areaId;

            this.areaSel = true;
            this.recuperarParametros()
          }
        }
    }
  },

  watch: {
    areaData: {
      handler: function (nuevo, oldVal) {
        this.verificarAreaSel(nuevo)
        //this.created();
      },
      deep: true
    },

    minutosper: {
      handler: function (nuevo, oldVal) {
        this.cambiarCantPer()
        this.cancelarAlmuerzoVerificacion()

        this.scheduleStore.setTimeInterval(nuevo)
      },
      deep: true
    },

    minutosAlmuerzo: {
      handler: function (nuevo, oldVal) {},
      deep: true
    },

    horainicio: {
      handler: function (nuevo, oldVal) {
        this.cambiarCantPer()
        this.cancelarAlmuerzoVerificacion()

        this.scheduleStore.setStartTime(nuevo)
      },
      deep: true
    },

    almuerzoIni: {
      handler: function (nuevo, oldVal) {},
      deep: true
    },

    horafin: {
      handler: function (nuevo, oldVal) {
        this.cambiarCantPer()
        this.cancelarAlmuerzoVerificacion()

        this.scheduleStore.setEndTime(nuevo)
      },
      deep: true
    },

    entrePer: {
      handler: function (nuevo, oldVal) {
        this.cambiarCantPer()
        this.cancelarAlmuerzoVerificacion()

        this.scheduleStore.setBetweenPeriod(nuevo)
      },
      deep: true
    },

    isAlmuerzo: {
      handler: function (nuevo, old) {
        this.cambiarCantPer()
        this.scheduleStore.setLunch(this.itemAlmuerzo[0], this.itemAlmuerzo[1], nuevo)
      }
    }
  }
}
</script>
