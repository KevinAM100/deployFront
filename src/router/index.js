import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'portal' }
    },

    {
      path: '/portal',
      name: 'portal',

      component: () => import('../views/portal/PortalView.vue')
    },

    {
      path: '/admin/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/admin/AdminDashboardView.vue')
    },
    {
      path: '/student/dashboard',
      name: 'dashboard_est',
      component: () => import('../views/users/student/StudentHomeView.vue')
    },
    {
      path: '/admin/areas',
      name: 'admin-areas',
      component: () => import('../views/admin/configgeneral/AreaView.vue')
    },
    {
      path: '/admin/careers',
      name: 'admin-careers',
      component: () => import('../views/admin/configgeneral/CareerView.vue')
    },
    {
      path: '/admin/subjects',
      name: 'admin-subjects',
      component: () => import('../views/admin/configgeneral/SubjectView.vue')
    },
    {
      path: '/admin/schedule',
      name: 'admin-schedule',
      component: () => import('../views/admin/configgeneral/ScheduleParamsView.vue')
    },
    {
      path: '/admin/itinerary',
      name: 'admin-itineraries',
      component: () => import('../views/admin/configclass/ItineraryView.vue')
    },

    {
      path: '/admin/manage-classes',
      component: () => import('../views/admin/configclass/ManageClassesView.vue'),
      children: [
        {
          path: '',
          name: 'admin-manage-classes',
          component: () => import('../views/admin/configclass/ManageClassesByYearView.vue')
        },
        {
          path: 'generate',
          component: () => import('../views/admin/configclass/ManageClassesGenerateView.vue')
        }
      ]
    },


    {
      path: '/admin/classroom',
      name: 'admin-classroom',
      component: () => import('../views/admin/configgeneral/ClassroomView.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/notfound/notFoundView.vue'),
      name: 'not-found'
    
    },
    
    {
      path: '/admin/academic-period',
      name: 'admin-academic-period',
      component: () => import('../views/admin/configgeneral/AcademicPeriodView.vue')
    },
    {
      path: '/admin/areas/:areaId/careers/:careerId/itineraries/:itineraryId',
      name: 'admin-see-itinerary',
      component: () => import('../views/admin/configclass/SeeItineraryView.vue')
    },
    {
      path:'/admin/areas/:areaId/careers/:careerId/itineraries/:itineraryId/itinerary-groups',
      name: 'admin-groups',
      component:()=> import('../views/admin/configclass/GroupView.vue')
    },
    {
      path: '/admin/classrooms',
      name: 'admin-classrooms',
      component: () => import('../views/admin/configgeneral/ClassroomView.vue')
    },
    {
      path: '/admin/areas/:areaId/careers/:careerId/itineraries/:itineraryId/edit',
      name: 'admin-edit-itinerary',
      component: () => import('../views/admin/configclass/EditGroupItineraryView.vue')
    },
    {
      path: '/student/matriculation',
      name: 'matriculation',
      component: () => import('../views/users/student/MatriculationView.vue')
    },
    {
      path: '/student/class-schedule',
      name: 'class-schedule',
      component: () => import('../views/users/student/ClassScheduleView.vue')
    },
    {
      path: '/student/kardex',
      name: 'kardex',
      component: () => import('../views/users/student/KardexView.vue')
    },
    {
      path: '/student/curriculum',
      name: 'curriculum',
      component: () => import('../views/users/student/CurriculumView.vue')
    },
    {
      path: '/portal/registration',
      name: 'registration',
      component: () => import('../views/portal/RegisterView.vue')
    },
  ]
})

export default router
