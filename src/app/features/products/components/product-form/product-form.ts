import { 
    Component,
    computed,
    ChangeDetectionStrategy, 
    input, 
    output,
    effect,
    inject
 } from '@angular/core';

 import {
     AbstractControl,
     AsyncValidatorFn,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
 } from '@angular/forms'

import { Product } from '../../product.model';
import { catchError, debounceTime, first, map, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../product.service';

interface ProductFormType {
    name: FormControl<string>,
    price: FormControl<number | null>
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm {
    private fb = new FormBuilder().nonNullable;
    private productService = inject(ProductService);
    
    productToEdit = input<Product | null>(null);

    save = output<Product>();
    cancel = output<void>();

    form = this.fb.group<ProductFormType>({
        name: this.fb.control('', {
            validators: [Validators.required, Validators.minLength(3)],
            asyncValidators: [this.uniqueNameValidator()],
            updateOn: 'blur'
        }),
        price: this.fb.control(null, [Validators.required, Validators.min(0.01), Validators.max(10000000)])
    });

    isEditMode = computed(() => !!this.productToEdit());

    constructor() {
        effect(() => {
            const product = this.productToEdit();
            if (product)
                this.form.patchValue({name: product.name, price: product.price})
            else
                this.form.reset();
        });
    }

    get name() { return this.form.get('name')}
    get price() { return this.form.get('price')}

    private uniqueNameValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null > => {
            if (!control.value)
                return of(null);

            return of (control.value).pipe(
                debounceTime(500),
                switchMap(name => {
                    const excludeId = this.productToEdit()?.id;
                    return this.productService.checkNameExists(name, excludeId);
                }),
                map(exists => (exists ? { nonUniqueName: true} : null)),
                first(),
                catchError(() => of(null))
            );
        }
    }

    onSubmit(): void {
        if (this.form.invalid)
            return;

        const formValue = this.form.getRawValue();
        const productData: Product = {
            id: this.productToEdit()?.id ?? 0,
            name: formValue.name,
            price: formValue.price!
        };
        this.save.emit(productData);
    }
}
