import { Component, OnInit } from "@angular/core";
import { CurrentViewService } from "./current-view.service";
import { CDSSService } from "../cdss.service";
import { DataStatus } from "../interface/cdss-interface";
import { forkJoin } from "rxjs";
import { AuthService } from "@core/auth/auth.service";

@Component({
  selector: "cds-current-view",
  templateUrl: "./current-view.component.html",
  styleUrls: ["./current-view.component.less"]
})
export class CurrentViewComponent implements OnInit {
  evaluateHistories: any[] = [];
  aiHistories: any[] = [];
  dataStatus: DataStatus = 1;

  constructor(
    private _currentViewService: CurrentViewService,
    private _auth: AuthService,
    private _cdssService: CDSSService
  ) {}
public  initList(): void {
    this.dataStatus = DataStatus.LOADING;
    forkJoin([
      this._currentViewService.getVisitScale(),
      this._currentViewService.getVisitAimodel()
    ]).subscribe(
      (data: any) => {
        if (data[0].length === 0 && data[1].length === 0) {
          this.dataStatus = DataStatus.NODATA;
        } else {
          this.dataStatus = DataStatus.NORMAL;
        }
        this.evaluateHistories = data[0];
        this.aiHistories = data[1];
      },
      () => {
        this.dataStatus = DataStatus.NODATA;
      }
    );
  }

  ngOnInit(): void {
    this._cdssService.pushPerformerId$.subscribe(res => {
      this.initList();
    });
    this._auth.tokenSubject$.subscribe(res => {
      if (this._auth.getToken()) {
        this.initList();
      }
    });
  }
}
