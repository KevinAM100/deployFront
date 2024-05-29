<script setup>
import { useForm, useField } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import { useUserDataStore } from '@/stores/portal/registroStore'
import { useRouter } from 'vue-router'

const router = useRouter();
const userDataStore = useUserDataStore()
var step = ref(0)

const next = () => {
  step.value++
}
//--------Form 1------------------------------
const nacionalidades = [
  'Alemán',
  'Argentino',
  'Australiano',
  'Austriaco',
  'Belga',
  'Boliviano',
  'Brasileño',
  'Británico',
  'Canadiense',
  'Chileno',
  'Chino',
  'Colombiano',
  'Coreano',
  'Danés',
  'Egipcio',
  'Emiratí',
  'Español',
  'Estadounidense',
  'Finlandés',
  'Francés',
  'Indio',
  'Indonesio',
  'Iraní',
  'Israelí',
  'Italiano',
  'Japonés',
  'Mexicano',
  'Neozelandés',
  'Nigeriano',
  'Noruego',
  'Paquistaní',
  'Peruano',
  'Portugués',
  'Ruso',
  'Saudí',
  'Sudafricano',
  'Sueco',
  'Suizo',
  'Turco',
  'Venezolano'
]
const extensionesCarnet = ['LP', 'CB', 'SC', 'OR', 'PT', 'CH', 'TJ', 'PA', 'BN', 'PD']

const schema = yup.object().shape({
  ci: yup
    .string()
    .required('El C.I. es requerido')
    .matches(/^[\d]+$/, 'El C.I. solo puede contener números')
    .min(5, 'El C.I. debe contener como mínimo 5 digitos')
    .max(10, 'El C.I. debe contener como máximo 10 digitos'),
  emitted: yup.string().required('El departamento donde fue emitido es requerido'),
  dateBirth: yup
    .string()
    .required('La fecha de nacimiento es requerida')
    .matches(/^\d{2}[-]\d{2}[-]\d{4}$/, 'El formato de fecha debe ser DD-MM-YYYY')
    .test('fecha valida', 'La fecha no es válida', function (value) {
      const [dayCurrent, monthCurrent, yearCurrent] = value.split('-').map(Number)
      const parsedDate = new Date(`${yearCurrent}-${monthCurrent}-${dayCurrent}`)
      if (isNaN(parsedDate.getTime())) {
        return false
      }

      const year = parsedDate.getFullYear()
      const month = parsedDate.getMonth() + 1
      const lastDayOfMonth = new Date(year, month, 0).getDate()

      return dayCurrent <= lastDayOfMonth && monthCurrent == month
    })
    .test(
      'no debe ser mayor que hoy',
      'La fecha no puede ser mayor que la fecha actual',
      (value) => {
        const [dayCurrent, monthCurrent, yearCurrent] = value.split('-')
        const fecha = new Date(yearCurrent, monthCurrent, dayCurrent)
        const fechaActual = new Date()
        return fecha <= fechaActual
      }
    ),
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe contener mas de 3 caracteres')
    .trim()
    .matches(/^[a-zA-ZñÑ\s]+$/, 'El campo solo puede contener letras y espacios'),
  lastNameP: yup
    .string()
    .required('El apellido paterno es requerido')
    .min(3, 'El apellido paterno debe contener mas de 3 caracteres')
    .matches(/^[a-zA-ZñÑ\s]+$/, 'El campo solo puede contener letras y espacios'),
  lastNameM: yup
    .string()
    .required('El apellido materno es requerido')
    .min(3, 'El apellido materno debe contener mas de 3 caracteres')
    .matches(/^[a-zA-ZñÑ\s]+$/, 'El campo solo puede contener letras y espacios'),
  gender: yup.string().required('El género es requerido'),
  address: yup.string().required('La dirección es requerida'),
  nationality: yup.string().required('La nacionalidad es requerida'),
  email: yup.string().required('El email es requerido').email('Debe ser un email válido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(5, 'La contraseña debe contener más de 5 caracteres'),
  passwordConfirm: yup
    .string()
    .required('La confirmación es requerida')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema
})

const ci = useField('ci', schema)
const emitted = useField('emitted', schema)
const dateBirth = useField('dateBirth', schema)
const name = useField('name', schema)
const lastNameP = useField('lastNameP', schema)
const lastNameM = useField('lastNameM', schema)
const gender = useField('gender', schema)
const address = useField('address', schema)
const nationality = useField('nationality', schema)
const email = useField('email', schema)
const password = useField('password', schema)
const passwordConfirm = useField('passwordConfirm', schema)

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  const userData = {
    idNumber: values.ci,
    issuedIn: values.emitted,
    dateOfBirth: values.dateBirth.split('-').reverse().join('-'),
    firstNames: values.name,
    paternalLastName: values.lastNameP,
    maternalLastName: values.lastNameM,
    nationality: values.nationality,
    gender: values.gender,
    email: values.email,
    currentAddress: values.address,
    password: values.password
  }
  await userDataStore.saveUserData(userData)
  resetForm()
  step.value++
})

//Send PDF to Store
const handleFileSelect = (event, type) => {
  const pdfStore = useUserDataStore();
  const file = event.target.files[0];
  if (type === 'pdf1') {
    pdfStore.setPdf1(file);
  } else if (type === 'pdf2') {
    pdfStore.setPdf2(file);
  }
};

const sendPdfsToBackend = async () => {
  try {
    await userDataStore.uploadPdfsToBackend();
    alert('Datos registrados correctamente');
    await router.push({ name: 'home'});
  } catch (error) {
    console.error('Error sending PDFs to Backend', error);
  }
};
//------------------------------------------------
</script>
<template>
  <v-app-bar color="transparent" dark style="background: linear-gradient(45deg, #001e89, #7d0000)">
    <v-app-bar-title>
      <p style="color: white; text-transform: uppercase; text-align: center; font-weight: bold">
        Gestión Académica
      </p>
    </v-app-bar-title>
  </v-app-bar>
  <v-bottom-navigation :elevation="0" style="position: static">
    <v-btn to="/">
      <span>INICIO</span>
    </v-btn>

    <v-btn>
      <span>FACULTADES</span>
    </v-btn>

    <v-btn>
      <span>ADMISIONES</span>
    </v-btn>
    <v-spacer></v-spacer>
  </v-bottom-navigation>
  <v-container>
    <p>REGISTRAR POSTULANTE</p>
    <br />
    <v-stepper v-model="step">
      <template v-slot:default="{ prev }">
        <v-stepper-header>
          <v-stepper-item
            :complete="step > 0"
            :color="step > 0 ? 'green' : ''"
            title="Paso 1 - Datos personales"
            value="1"
          ></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item
            :complete="step > 1"
            :color="step > 1 ? 'green' : ''"
            title="Paso 2 - Subir fotografía"
            value="2"
          ></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item
            :complete="step > 2"
            :color="step > 2 ? 'green' : ''"
            title="Paso 3 - Documentos oficiales"
            value="3"
          ></v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item value="1">
            <v-form @submit.prevent="onSubmit">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    label="Nro. de C.I."
                    v-model="ci.value.value"
                    :error-messages="ci.errorMessage.value"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    :items="extensionesCarnet"
                    label="Emitido en"
                    v-model="emitted.value.value"
                    :error-messages="emitted.errorMessage.value"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Fecha de Nacimiento"
                    prepend-inner-icon="mdi-calendar"
                    v-model="dateBirth.value.value"
                    :error-messages="dateBirth.errorMessage.value"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <v-text-field
                    label="Nombres"
                    v-model="name.value.value"
                    :error-messages="name.errorMessage.value"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Apellido Paterno"
                    v-model="lastNameP.value.value"
                    :error-messages="lastNameP.errorMessage.value"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Apellido Materno"
                    v-model="lastNameM.value.value"
                    :error-messages="lastNameM.errorMessage.value"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4"
                  ><v-select
                    :items="['Masculino', 'Femenino']"
                    label="Sexo"
                    v-model="gender.value.value"
                    :error-messages="gender.errorMessage.value"
                  ></v-select
                ></v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Dirección actual"
                    v-model="address.value.value"
                    :error-messages="address.errorMessage.value"
                  ></v-text-field>
                </v-col>
                <v-col cols="4"
                  ><v-select
                    :items="nacionalidades"
                    label="Nacionalidad"
                    v-model="nationality.value.value"
                    :error-messages="nationality.errorMessage.value"
                  ></v-select
                ></v-col>
              </v-row>

              <v-row>
                <v-col cols="4"
                  ><v-text-field
                    label="Email"
                    v-model="email.value.value"
                    :error-messages="email.errorMessage.value"
                  >
                  </v-text-field
                ></v-col>
                <v-col cols="4"
                  ><v-text-field
                    label="Contraseña"
                    type="password"
                    v-model="password.value.value"
                    :error-messages="password.errorMessage.value"
                  >
                  </v-text-field
                ></v-col>
                <v-col cols="4"
                  ><v-text-field
                    label="Confirmar contraseña"
                    type="password"
                    v-model="passwordConfirm.value.value"
                    :error-messages="passwordConfirm.errorMessage.value"
                  >
                  </v-text-field
                ></v-col>
              </v-row>
              <v-stepper-actions prev-text="Anterior" @click:prev="prev" disabled="prev">
                <template v-slot:next>
                  <v-btn type="submit" class="v-stepper__action"> Siguiente </v-btn>
                </template>
              </v-stepper-actions>
            </v-form>
          </v-stepper-window-item>

          <v-stepper-window-item value="2">
            <span>2</span>
            <v-stepper-actions prev-text="Anterior" @click:prev="prev" disabled="prev">
              <template v-slot:next>
                <v-btn type="submit" class="v-stepper__action" @click="next"> Siguiente </v-btn>
              </template>
            </v-stepper-actions>
          </v-stepper-window-item>

          <v-stepper-window-item value="3">
            <v-card-text>
              <v-row>
                <v-col>
                  <v-file-input
                      label="Carnet de Identidad"
                      type="file"
                      prepend-icon="mdi-file-document-outline"
                      accept=".pdf"
                      @change="handleFileSelect($event, 'pdf1')"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-file-input
                      label="Diploma o Libreta"
                      type="file"
                      prepend-icon="mdi-file-document-outline"
                      accept=".pdf"
                      @change="handleFileSelect($event, 'pdf2')"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-card-text>

            <v-stepper-actions prev-text="Anterior" @click:prev="prev" disabled="prev">
              <template v-slot:next>
                <v-btn type="submit" class="v-stepper__action" @click="sendPdfsToBackend"> Registrar </v-btn>
              </template>
            </v-stepper-actions>
          </v-stepper-window-item>
        </v-stepper-window>
      </template>
    </v-stepper>
  </v-container>
</template>

<style scoped>
p {
  font-weight: 900;
  font-size: 20px;
}

span {
  font-weight: bold;
}

.v-bottom-navigation {
  position: static;
}
</style>
