import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductService, CreateProductDto, UpdateProductDto } from '../../product.service';
import { Product } from '../../product.model';
import { ProductForm } from '../product-form/product-form';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-product-list',
  standalone: true,  
  imports: [ProductForm, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
    title = input.required<string>();    

    private productService = inject(ProductService);
        
    products = signal<Product[]>([]);
    productCount = computed(() => this.products().length);
    selectedProduct = signal<Product | null>(null);
    showForm = signal(false);
    isLoading = signal(true);

    isEditMode = computed(() => !!this.selectedProduct());

    ngOnInit(): void {
        this.loadProducts();
    }
    
    loadProducts(): void {
        this.isLoading.set(true);
        this.productService.getProducts()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(data => this.products.set(data));
    }

    onAdd(): void {
        this.selectedProduct.set(null);
        this.showForm.set(true);
    }

    onEdit(product:Product): void {
        this.selectedProduct.set(product);
        this.showForm.set(true);
    }

    onDelete(product: Product): void {
        if (!confirm(`Are you sure you want to delete ${product.name}`)) return;

        this.productService.deleteProduct(product.id).subscribe(() => {
            this.products.update(p => p.filter(item => item.id !== product.id));
        });
        
        alert("Product deleted succesfully!");
    }

    onFormSave(productData: Product): void {
        const successMessage = this.isEditMode() ? 'Product Updated' : 'Product Created';

        if (this.isEditMode()){
            this.productService.updateProduct(productData.id, productData).subscribe({
                next: () => {
                    this.loadProducts();
                    this.onFormCancel();
                }
            });
        } else {
            this.productService.createProduct(productData).subscribe({
                next: () => {
                    this.loadProducts();
                    this.onFormCancel();
                }
            });
        }        
    }

    onFormCancel(): void {
        this.selectedProduct.set(null);
        this.showForm.set(false);
    }
}
