import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { HistoryListComponent } from "./history-list.component";
import { TransformTimePipe } from "../../pipe/transform-time.pipe";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { CDSSService } from "../../cdss.service";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
let cdssService: CDSSService;
describe("HistoryListComponent", () => {
  let component: HistoryListComponent;
  let fixture: ComponentFixture<HistoryListComponent>;
  let heroDe: DebugElement;
  let heroEl: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgZorroAntdModule],
      declarations: [HistoryListComponent, TransformTimePipe],
      providers: [{ provide: CDSSService, useValue: cdssService }]
    });
    fixture = TestBed.createComponent(HistoryListComponent);
    component = fixture.componentInstance;

    const expectedList = [
      {
        obsTime: "2017.11.11 01:11:11",
        name: "【aaa】sss",
        tip: "高危"
      }
    ];
    const expectedType = "AI";
    component.list = expectedList;
    component.type = expectedType;
    fixture.detectChanges();
  }));
  it("get time from HistoryListComponent", () => {
    heroDe = fixture.debugElement.query(By.css(".item-time"));
    heroEl = heroDe.nativeElement;
    fixture.detectChanges();
    expect(heroEl.textContent).toContain("11-11 01:11");
  });
  it("get title from HistoryListComponent", () => {
    heroDe = fixture.debugElement.query(By.css(".item-title"));
    heroEl = heroDe.nativeElement;
    expect(heroEl.textContent).toContain("sss");
  });
  it("get operation from HistoryListComponent", () => {
    heroDe = fixture.debugElement.query(By.css(".item-operation"));
    heroEl = heroDe.nativeElement;
    expect(heroEl.textContent).toContain("详情");
  });
  it("get grade from HistoryListComponent", () => {
    heroDe = fixture.debugElement.query(By.css(".item-grade"));
    heroEl = heroDe.nativeElement;
    expect(heroEl.textContent).toContain("高危");
  });
});
