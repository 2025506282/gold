import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth';

@Component({
  selector: 'cds-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.less']
})
export class NoDataComponent implements OnInit {

  constructor(private router: Router,
              private _auth: AuthService) { }

  ngOnInit(): void {
  }

  public refreshPage(): void {
    this.router.navigate(['/']);
    this._auth.patientSubject$.next(true);
  }
}
