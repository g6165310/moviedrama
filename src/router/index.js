import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Popular from '../views/Popular.vue'
import Layout from '../views/Layout.vue'
import SearchResult from '../views/SearchResult.vue'
import Person from '../views/Person.vue'
import NotFound from '../views/NotFound.vue'
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/popular/:type',
        component: Popular,
        beforeEnter: (to, from, next) => {
          if (to.params.type === 'movie' || to.params.type === 'tv') {
            next()
          } else {
            next('NotFound')
          }
        }

      },
      {
        path: 'search',
        name: 'search',
        component: SearchResult,
        beforeEnter: (to, from, next) => {
          if (to.query.search) {
            next()
          } else {
            next('NotFound')
          }
        }
      },
      {
        path: 'movie/:id(\\d+)',
        name: 'Details',
        alias: 'tv/:id(\\d+)',
        component: () => import('../views/Details.vue')
      },
      {
        path: 'actor/:id',
        name: 'Person',
        component: Person
      },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }

    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from) {
    return { top: 0 }
  }
})

export default router
