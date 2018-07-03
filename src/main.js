import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import underscore from 'vue-underscore';

import App from './App.vue'
import { routes } from './routes';
import store from './store/store.js';
import {isEmpty} from './helpers/helpers.js';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(underscore);

const router = new VueRouter({
    mode: 'history',
    routes
});


router.beforeEach((to, from, next) => {
    let path = to.path;
    if (!(path === '/' || path === '/users/login')) {
        if (isEmpty(store.getters.user)) {
            next({
                path: '/users/login'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

new Vue({
    el: '#app',
    router: router,
    store,
    render: h => h(App)
});

Vue.http.options.emulateJSON = true
const http=Vue.http;
 export default http;
