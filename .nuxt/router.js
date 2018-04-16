'use strict'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const _41aaa08d = () => import('E:\\carefree-element-ui\\carefree\\pages\\index.vue' /* webpackChunkName: "pages/index" */)

const _0b5243a4 = () => import('E:\\carefree-element-ui\\carefree\\pages\\login.vue' /* webpackChunkName: "pages/login" */)

const _21f2c5c8 = () => import('E:\\carefree-element-ui\\carefree\\pages\\about.vue' /* webpackChunkName: "pages/about" */)

const _2f4010b8 = () => import('E:\\carefree-element-ui\\carefree\\pages\\admin\\index.vue' /* webpackChunkName: "pages/admin" */)

const _285e9b30 = () => import('E:\\carefree-element-ui\\carefree\\pages\\admin\\unsolved.vue' /* webpackChunkName: "pages/admin-unsolved" */)

const _4ca3a085 = () => import('E:\\carefree-element-ui\\carefree\\pages\\admin\\problem.vue' /* webpackChunkName: "pages/admin-problem" */)

const _7ca4638f = () => import('E:\\carefree-element-ui\\carefree\\pages\\admin\\solved.vue' /* webpackChunkName: "pages/admin-solved" */)



const scrollBehavior = (to, from, savedPosition) => {
  // savedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // if no children detected
    if (to.matched.length < 2) {
      // scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // if one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // if link has anchor,  scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
  		{
			path: "/",
			component: _41aaa08d,
			name: "index"
		},
		{
			path: "/login",
			component: _0b5243a4,
			name: "login"
		},
		{
			path: "/about",
			component: _21f2c5c8,
			name: "about"
		},
		{
			path: "/admin",
			component: _2f4010b8,
			name: "admin"
		},
		{
			path: "/admin/unsolved",
			component: _285e9b30,
			name: "admin-unsolved"
		},
		{
			path: "/admin/problem",
			component: _4ca3a085,
			name: "admin-problem"
		},
		{
			path: "/admin/solved",
			component: _7ca4638f,
			name: "admin-solved"
		}
    ]
  })
}
