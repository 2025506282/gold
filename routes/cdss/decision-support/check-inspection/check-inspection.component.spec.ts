import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CheckInspectionComponent } from './check-inspection.component';

describe('CheckInspectionComponent', () => {
    let component : CheckInspectionComponent;
    let fixture : ComponentFixture<CheckInspectionComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
              CheckInspectionComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(CheckInspectionComponent);
        component = fixture.componentInstance; // CDSSComponent test instance
    });
    
})