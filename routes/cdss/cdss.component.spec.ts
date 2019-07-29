import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CDSSComponent } from './cdss.component';
describe('CDSSComponent', () => {
    let component : CDSSComponent;
    let fixture : ComponentFixture<CDSSComponent>;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                CDSSComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(CDSSComponent);
        component = fixture.componentInstance; // CDSSComponent test instance
    });
})