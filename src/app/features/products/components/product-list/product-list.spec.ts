import { ComponentFixture, TestBed, DeferBlockState } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductList } from './product-list';
import { ProductService } from '../../product.service';
import { Product } from '../../product.model';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let component: ProductList;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Signal-Powered Laptop', price: 1500 },
    { id: 2, name: 'Reactive Mouse', price: 90 },
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', {
      getProducts: of(mockProducts), // Mock the service to return an Observable
    });

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product count from a computed signal', async () => {
    // 1. Set the required input property
    fixture.componentRef.setInput('title', 'Test Catalog');
    fixture.detectChanges(); // Initial render

    // 2. Wait for the products to load
    await fixture.whenStable();
    fixture.detectChanges(); // Update the view after data arrives

    // 3. Assert the component's internal state
    expect(component.products().length).toBe(2);
    expect(component.productCount()).toBe(2);

    // 4. Update the DOM assertion to match the actual template
    // The current template doesn't display the count in a <p> tag.
    // Assuming you'll add an element to display the count.
    // For example, if you add <p>Total Products: {{ productCount() }}</p> to your template:
    const compiled = fixture.nativeElement as HTMLElement;
    const countElement = compiled.querySelector('.product-count'); // Or whatever selector you use
    expect(countElement?.textContent).toContain('Total Products: 2');
});  
});