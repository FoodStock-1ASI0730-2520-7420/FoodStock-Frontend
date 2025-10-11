import {createRouter, createWebHistory, RouterView} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
import InventoryView from './inventory/presentation/views/InventoryView.vue';
import ItemsView from './inventory/presentation/views/ItemsView.vue';
import ProductsView from './inventory/presentation/views/ProductsView.vue';
import SuppliersView from './suppliers/presentation/views/suppliersView.vue';
import salesRoutes from "./sales/presentation/sale-routes.js";
import reportsRoutes from "./reports/reports.routes.js";
import ReservationView from "./reservation/presentation/views/ReservationView.vue";
// TODO: Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/',                redirect: '/home' },
    { path: '/sales',            name: 'sales',       children: salesRoutes },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    {
        path: '/suppliers',
        name: 'SuppliersManagement',
        component: SuppliersView,
        meta: { title: 'Manage Suppliers' }
    },
    {
        path: '/inventory',
        component: InventoryView,
        meta: { title: 'Inventory' },
        children: [
            {
                path: 'items',
                name: 'ItemsManagement',
                component: ItemsView,
                meta: { title: 'Manage Items' }
            },
            {
                path: 'products',
                name: 'ProductsManagement',
                component: ProductsView,
                meta: { title: 'Manage Products' }
            }
        ]
    },
    {
        path: '/reservations',
        name: 'reservations',
        component: ReservationView,
        meta: { title: 'Reservations' }
    },
    {
        path: "/reports",
        component: RouterView,
        children: reportsRoutes
    }
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