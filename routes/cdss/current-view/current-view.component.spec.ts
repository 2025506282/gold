import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { CurrentViewComponent } from './current-view.component';
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CurrentViewService } from "./current-view.service";
import { AuthService } from "@core/auth";
import { CDSSService } from "../cdss.service";
@Component({ selector: 'cds-patient-bar', template: '' })
class PatientBarComponent { }

@Component({ selector: 'cds-data-loading-status', template: '' })
class DataLoadingStatusComponent {
  @Input() componentTemplate: any;
  @Input() dataStatus: number;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
}

@Component({ selector: 'cds-card', template: '' })
class CardComponent { }

@Component({ selector: 'cds-history-list', template: '' })
class HistoryListComponent {
  @Input() list: any[];
  @Input() type: any;
}
describe('CurrentViewComponent', () => {
  let component: CurrentViewComponent;
  let fixture: ComponentFixture<CurrentViewComponent>;
  const currentViewService = jasmine.createSpyObj('CurrentViewService', ['getVisitScale', 'getVisitAimodel']);
  const cdssService = jasmine.createSpyObj('CDSSService', ['pushPerformerId$']);
  const authService = jasmine.createSpyObj('AuthService', ['tokenSubject$']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [
        CurrentViewComponent,
        PatientBarComponent,
        DataLoadingStatusComponent,
        CardComponent,
        HistoryListComponent
      ],
      providers: [
        CurrentViewComponent,
        { provide: CurrentViewService, useValue: currentViewService },
        { provide: AuthService, useValue: authService },
        { provide: CDSSService, useValue: cdssService },
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    component = TestBed.get(CurrentViewComponent);
  });
  it('should create CurrentViewComponent', () => {
    expect(component).toBeDefined();
  })
})