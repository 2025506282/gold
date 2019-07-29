import { CDSSService } from "./cdss.service";
import { ArkService } from '@core/ark/ark.service';
import { AuthService } from '@core/auth';
import { HttpClient } from '@angular/common/http';
import { RelyOnEnvironmentService } from '@core/rely-on-environment/rely-on-environment.service';
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CDSSService', () => {
    let cdssService: CDSSService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule], 
            providers: [
                CDSSService,
                HttpClient,
                ArkService,
                RelyOnEnvironmentService,
                AuthService
            ]
        });
        cdssService = TestBed.get(CDSSService);
    })
    it('should use CDSSService', () => {
        cdssService.initData();
        expect(cdssService.performerId).toBe('');
    })
})