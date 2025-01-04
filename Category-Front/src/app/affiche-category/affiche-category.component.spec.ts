import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheCategoryComponent } from './affiche-category.component';

describe('AfficheCategoryComponent', () => {
  let component: AfficheCategoryComponent;
  let fixture: ComponentFixture<AfficheCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficheCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfficheCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
