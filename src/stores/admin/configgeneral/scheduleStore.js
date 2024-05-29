import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('myStore', {
  state: () => ({
    posItemsInitalSelected: [],
    isEqualsValue: true,
    daysListString: [],
    daysItemsSelected: [],
    periodsActive: [],
    valorIni: {
      "mondaySchedule": true,
      "tuesdaySchedule": true,
      "wednesdaySchedule": true,
      "thursdaySchedule": true,
      "fridaySchedule": true,
      "saturdaySchedule": true,
      "sundaySchedule": false,
      "startTimeSchedule": null,
      "endTimeSchedule": null,
      "timeIntervalSchedule": 0,
      "lunchTimeSchedule": false,
      "startLunchTimeSchedule": null,
      "endLunchTimeSchedule": null,
      "betweenPeriod": 0
    },
    valorAct: {
      "mondaySchedule": true,
      "tuesdaySchedule": true,
      "wednesdaySchedule": true,
      "thursdaySchedule": true,
      "fridaySchedule": true,
      "saturdaySchedule": true,
      "sundaySchedule": false,
      "startTimeSchedule": null,
      "endTimeSchedule": null,
      "timeIntervalSchedule": 0,
      "lunchTimeSchedule": false,
      "startLunchTimeSchedule": null,
      "endLunchTimeSchedule": null,
      "betweenPeriod": 0
    },
  }),
  actions: {
    setPosItemsInitalSelected(values) {
      this.posItemsInitalSelected = values

      this.equalsValues()
    },

    setSelectedPeriods(list) {
      this.periodsActive = list

      this.equalsValues();
    },

    setDays(daysItems) {
      for (let i = 0; i < 7; i++) {
        let valueItem = daysItems.includes(i);

        if (i == 0) {
          this.valorAct.mondaySchedule = valueItem;
        } else if (i == 1) {
          this.valorAct.tuesdaySchedule = valueItem;
        } else if (i == 2) {
          this.valorAct.wednesdaySchedule = valueItem;
        } else if (i == 3) {
          this.valorAct.thursdaySchedule = valueItem;
        } else if (i == 4) {
          this.valorAct.fridaySchedule = valueItem;
        } else if (i == 5) {
          this.valorAct.saturdaySchedule = valueItem;
        } else if (i == 6) {
          this.valorAct.sundaySchedule = valueItem;
        }
      }

      this.equalsValues()
      this.setDaysList();
    },

    setDaysBool(days) {
      for (let i = 0; i < days.length; i++) {
        let valueItem = days[i];

        if (i == 0) {
          this.valorAct.mondaySchedule = valueItem;
        } else if (i == 1) {
          this.valorAct.tuesdaySchedule = valueItem;
        } else if (i == 2) {
          this.valorAct.wednesdaySchedule = valueItem;
        } else if (i == 3) {
          this.valorAct.thursdaySchedule = valueItem;
        } else if (i == 4) {
          this.valorAct.fridaySchedule = valueItem;
        } else if (i == 5) {
          this.valorAct.saturdaySchedule = valueItem;
        } else if (i == 6) {
          this.valorAct.sundaySchedule = valueItem;
        }
      }

      this.equalsValues()
      this.setDaysList();
    },

    setStartTime(time) {
      this.valorAct.startTimeSchedule = time;

      this.equalsValues()
    },

    setEndTime(time) {
      this.valorAct.endTimeSchedule = time

      this.equalsValues()
    },

    setTimeInterval(minutes) {
      this.valorAct.timeIntervalSchedule = minutes

      this.equalsValues()
    },

    setBetweenPeriod(minutes) {
      this.valorAct.betweenPeriod = minutes

      this.equalsValues()
    },

    setLunch(start, end, activated) {
      if (activated) {
        this.valorAct.lunchTimeSchedule = true;
        this.valorAct.startLunchTimeSchedule = start;
        this.valorAct.endLunchTimeSchedule = end;
      } else {
        this.valorAct.lunchTimeSchedule = false;
        this.valorAct.startLunchTimeSchedule = null;
        this.valorAct.endLunchTimeSchedule = null;
      }

      this.equalsValues()
    },

    setValorIniCopy() {
      this.valorIni = Object.assign(this.valorAct);
      console.log("Me llaman xD")

      this.equalsValues()
    },

    setValorIni(valorLeido,) {
      for (var key in valorLeido) {
        if (Object.prototype.hasOwnProperty.call(this.valorIni, key)) {

          if (key === "startLunchTimeSchedule" || key === "endLunchTimeSchedule" || key === "startTimeSchedule" || key === "endTimeSchedule") {
            this.valorIni[key] = this.timeToStringData(valorLeido[key])
          } else {
            this.valorIni[key] = valorLeido[key];
          }


        }
      }

      this.setDaysList();
    },

    timeToStringData(data) {
      let res = null
      if (data) {
        res = this.fHora(data[0]) + ':' + this.fHora(data[1])
      }

      return res
    },

    fHora(numero) {
      return numero < 10 ? '0' + numero : numero
    },

    equalsValues() {

      let igualesSel = true;

      for (let i = 0; i < this.posItemsInitalSelected.length; i++) {
        if (!this.periodsActive.includes(this.posItemsInitalSelected[i])) {
          igualesSel = false;
        }
      }

      this.isEqualsValue = JSON.stringify(this.valorAct) === JSON.stringify(this.valorIni) && igualesSel;
    },

    setEqualsValues(value) {
      this.isEqualsValue = value;
    },

    setDaysList() {

      let listaBool = [
        this.valorAct.mondaySchedule,
        this.valorAct.tuesdaySchedule,
        this.valorAct.wednesdaySchedule,
        this.valorAct.thursdaySchedule,
        this.valorAct.fridaySchedule,
        this.valorAct.saturdaySchedule,
        this.valorAct.sundaySchedule]

      let nameDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

      let diasSel = [];
      for (let i = 0; i < nameDays.length; i++) {
        if (listaBool[i] === true) {
          diasSel.push(nameDays[i]);
        }
      }

      this.daysListString = nameDays;


      let listaItems = []
      for (let i = 0; i < listaBool.length; i++) {
        if (listaBool[i] === true) {
          listaItems.push(i);
        }
      }

      this.daysItemsSelected = listaItems;

    }
  }
})
