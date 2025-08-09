import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () => 
            import('./features/products/components/product-list/product-list').then((c) => c.ProductList),
            data: {
                title: 'Our Products Catalog'
            }
     },
     {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full'
     }
];
