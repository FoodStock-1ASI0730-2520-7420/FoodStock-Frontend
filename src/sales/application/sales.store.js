import {SalesApi} from "../infrastructure/sales-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SaleAssembler} from "../infrastructure/sale.assembler.js";
import {SaleItemAssembler} from "../infrastructure/saleItem.assembler.js";

const salesApi = new SalesApi();

const useSalesStore= defineStore('sales', () => {

    const sales = ref([]);
    const saleItems = ref([]);
    const errors = ref([]);
    const salesLoaded = ref(false);
    const saleItemsLoaded = ref(false);
    const salesCount = computed(() => {
        return salesLoaded.value ? sales.value.length : 0;
    });
    const saleItemsCount = computed(() => {
        return saleItemsLoaded.value ? saleItems.value.length : 0;
    });

    function fetchSales() {
        salesApi.getSales().then(response => {
            sales.value = SaleAssembler.toEntitiesFromResponse(response);
            salesLoaded.value = true;
            console.log(salesLoaded.value);
            console.log(sales.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function fetchSaleItems(sale) {
        salesApi.getSaleItemBySaleId(sale).then(response => {
            saleItems.value = SaleItemAssembler.toEntitiesFromResponse(response);
            saleItemsLoaded.value = true;
            console.log(saleItemsLoaded.value);
            console.log(saleItems.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getSaleById(id) {
        let idNum = parseInt(id);
        return sales.value.find(sale => sale["id"] === idNum);
    }

    function addSale(sale) {
        const { saleItems, ...saleData} = sale;
        return salesApi.createSale(saleData).then(response => {
            const resource = response.data;
            const newSale = SaleAssembler.toEntityFromResource(resource);
            sales.value.push(newSale);
            return response;
        }).catch(error => {
            errors.value.push(error);
            throw  error;
        });
    }

    function updateSale(sale) {
        const { saleItems, ...saleData} = sale;
        salesApi.updateSale(saleData).then(response => {
            const resource = response.data;
            const updatedSale = SaleAssembler.toEntityFromResource(resource);
            const index = sales.value.findIndex(s => s["id"] === updatedSale.id);
            if (index !== -1) sales.value[index] = updatedSale;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteSale(sale) {
        salesApi.deleteSale(sale.id).then(() => {
            const index = sales.value.findIndex(s => s["id"] === sale.id);
            if (index !== -1) sales.value.splice(index, 1);
            saleItems.value = saleItems.value.filter(saleItem => saleItem.saleId !== sale.id);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getSaleItemBySaleId(sale) {
        return saleItems.value.filter(saleItem => saleItem["id"] === sale);
    }

    function addSaleItem(saleItem) {
        return salesApi.createSaleItem(saleItem).then(response => {
            const resource = response.data;
            const newSaleItem = SaleItemAssembler.toEntityFromResource(resource);
            saleItems.value.push(newSaleItem);
            return response;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function updateSaleItem(saleItem) {
        salesApi.updateSaleItem(saleItem).then(response => {
            const resource = response.data;
            const updatedSaleItem = SaleItemAssembler.toEntityFromResource(resource);
            const index = saleItems.value.findIndex(s => s["id"] === updatedSaleItem.id);
            if (index !== -1) saleItems.value[index] = updatedSaleItem;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteSaleItem(saleItem) {
        salesApi.deleteSaleItem(saleItem.id).then(() => {
            const index = saleItems.value.findIndex(s => s["id"] === saleItem.id);
            if (index !== -1) saleItems.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        sales,
        saleItems,
        errors,
        salesLoaded,
        saleItemsLoaded,
        salesCount,
        saleItemsCount,
        fetchSales,
        fetchSaleItems,
        getSaleById,
        addSale,
        updateSale,
        deleteSale,
        addSaleItem,
        updateSaleItem,
        deleteSaleItem,
        getSaleItemBySaleId
    }
});

export default useSalesStore;