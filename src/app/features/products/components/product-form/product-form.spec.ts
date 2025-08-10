import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      //providers: [provideAnimations()]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when fields are empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should be valid when all fields are correctly filled', () => {
    component.form.setValue({ name: 'Valid Product', price: 123 });
    expect(component.form.valid).toBeTruthy();
  });

  it('should emit a save event on submit with valid data', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ name: 'Test Product', price: 50 });
    fixture.detectChanges();

    component.onSubmit();
    
    expect(component.save.emit).toHaveBeenCalledWith({
      id: 0,
      name: 'Test Product',
      price: 50
    });
  });
});