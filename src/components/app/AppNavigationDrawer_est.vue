<script setup>
import { ref } from 'vue';
import Profile from "@/components/app/Profile.vue";

const drawer = ref(true);
const rail = ref(false);

const menuGroupList = ref([
  {
    name: 'Académico',
    value: 'Academic',
    icon: 'mdi-school',
    subMenus:[
      {
        name:'Matriculación',
        value: 'matriculation',
        route:'/student/matriculation'
      },
      {
        name:'Horario de clases',
        value: 'class-schedule',
        route: '/student/class-schedule'
      },
      {
        name:'Kardex',
        value: 'kardex',
        route: '/student/kardex'
      },
      {
        name:'Malla Curricular',
        value: 'curriculum',
        route:'/student/curriculum'
      },
      {
        name:'documentos off',
        value: 'doc-off',
        route:'/student/page3'
      },


    ]
  }
])
</script>

<template>
  <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
  >
    <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="UMSS"
        nav
    >
      <template v-slot:append>
        <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact">
      <v-list-item prepend-icon="mdi-home" title="Inicio" value="student" router :to="{ name: 'dashboard_est' }"/>
      <v-list-group v-for="menuGroup in menuGroupList" :key="menuGroup.value" :value="menuGroup.value">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="menuGroup.icon" :title="menuGroup.name"></v-list-item>
        </template>
        <v-list-item
            v-for="subMenu in menuGroup.subMenus"
            :key="subMenu.value"
            :value="subMenu.value"
            :title="subMenu.name"
            router :to="subMenu.route"
        ></v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <div class="pa-2" >
        <v-btn  block color="transparent" dark  style="background: linear-gradient(45deg, #001E89, #7D0000);" class="my-5" :to="{ name: 'portal' }">
          <p style="color: white; text-align: center; font-weight: bold;" >CERRAR SESIÓN</p>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <v-app-bar color="transparent" dark  style="background: linear-gradient(45deg, #001E89, #7D0000);" >
  <v-app-bar-title>
    <p style="color: white; text-transform: uppercase; text-align: center; font-weight: bold;"> Gestión Académica - Estudiantes</p>
  </v-app-bar-title>
  </v-app-bar>
  <Profile/>
</template>
