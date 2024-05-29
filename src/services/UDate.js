export default class UDate {

    static getListDayEs() {
        return ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];
    }
    
    static getListDayEn() {
        return ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    }    

    static getDayEs(day) {
        const days = {
            "MONDAY": "LUNES",
            "TUESDAY": "MARTES",
            "WEDNESDAY": "MIÉRCOLES",
            "THURSDAY": "JUEVES",
            "FRIDAY": "VIERNES",
            "SATURDAY": "SÁBADO",
            "SUNDAY": "DOMINGO"
        };
        return days[day.toUpperCase()] || "Invalid day";
    }

    static getDayEn(day) {
        const days = {
            "LUNES": "MONDAY",
            "MARTES": "TUESDAY",
            "MIÉRCOLES": "WEDNESDAY",
            "JUEVES": "THURSDAY",
            "VIERNES": "FRIDAY",
            "SÁBADO": "SATURDAY",
            "DOMINGO": "SUNDAY"
        };
        return days[day.toUpperCase()] || "Invalid day";
    }

    static getHourString(hour) {
        const hourString = hour.map(num => num.toString().padStart(2, '0')).join(':');
        return hourString;
    }    

    static getABDay(day) {
        const abDays = {
            "LUNES": "LU",
            "MARTES": "MA",
            "MIÉRCOLES": "MI",
            "JUEVES": "JU",
            "VIERNES": "VI",
            "SÁBADO": "SA",
            "DOMINGO": "DO"
        };
        return abDays[day.toUpperCase()] || "Invalid day";
    }
}