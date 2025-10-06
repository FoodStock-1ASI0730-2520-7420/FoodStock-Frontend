import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
import ItemsView from './Inventory/presentation/views/ItemsView.vue'
import ProductsView from './Inventory/presentation/views/ProductsView.vue';

// TODO: Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/',                redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    {path: '/inventory/items', name: 'ItemsManagement', component: ItemsView, meta: { title: 'Manage Items' } },
    { path: '/inventory/products', name: 'ProductsManagement', component: ProductsView, meta: { title: 'Manage Products' } },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,

});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'FoodStock';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // TODO: Call authentication guard
    next();
});

export default router;