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

    // 2. Wait for async operations like `toSignal` to complete
    await fixture.whenStable();

    // 3. Assert the component's internal state (this should already be correct)
    expect(component.productCount()).toBe(2);

    // 4. Get a handle on the deferred block and manually trigger its rendering
    const deferBlocks = await fixture.getDeferBlocks();
    await deferBlocks[0].render(DeferBlockState.Complete); // Force the @defer block to render its content

    // 5. Now, assert the DOM state after the deferred content has been rendered
    const compiled = fixture.nativeElement as HTMLElement;
    const countParagraph = compiled.querySelector('p');
    expect(countParagraph?.textContent).toContain('Total Products: 2');
  });
});