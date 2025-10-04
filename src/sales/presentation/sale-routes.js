const saleForm = () => import('./view/sale-form.vue');
const saleList = () => import('./view/sale-list.vue');

const salesRoutes = [
    {   path: 'new',         name: 'sale-new',    component: saleForm, meta: {title: 'New Sale'}},
    {   path: 'list/:id/edit',    name: 'sale-edit',   component: saleForm, meta: {title: 'Edit Sale'}},
    {   path: 'list',              name: 'sales-list',       component: saleList, meta: {title: 'Sales'}},
];

export default salesRoutes;