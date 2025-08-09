import { Component, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductService } from '../../product.service';


@Component({
  selector: 'app-product-list',
  standalone: true,  
  imports: [CommonModule, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
    title = input.required<string>();    

    private productService = inject(ProductService);

    private productsResponse = toSignal(this.productService.getProducts());

    products = computed(() => this.productsResponse() ?? []);

    isLoading = computed(() => this.productsResponse() ?? []);

    productCount = computed(() => this.products().length);
}
