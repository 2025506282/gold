import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CDSSComponent } from './cdss.component';
import { CDSSService } from './cdss.service';
import { DecisionSupportComponent } from './decision-support/decision-support.component';
import { DecisionSupportService } from './decision-support/decision-support.service';
import { TransformRiskPipe } from './pipe/transform-risk.pipe';
import { HtmlPipe } from './pipe/html.pipe';
import { CurrentVisitComponent } from './current-visit/current-visit.component';
import { ClinicalPathwayComponent } from './clinical-pathway/clinical-pathway.component';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { DiagnosisMonitorComponent } from './decision-support/diagnosis-monitor/diagnosis-monitor.component';
import { CollapseItemComponent } from './decision-support/diagnosis-monitor/collapse-item/collapse-item.component';
import { DiagnosisMonitorHistoryComponent } from './decision-support/diagnosis-monitor-history/diagnosis-monitor-history.component';
import { TreatmentPlanComponent } from './decision-support/treatment-plan/treatment-plan.component';
import { ConditionAnalysisComponent } from './decision-support/condition-analysis/condition-analysis.component';
import { CheckInspectionComponent } from './decision-support/check-inspection/check-inspection.component';
import { RecommendedDiagnosticComponent } from './decision-support/recommended-diagnostic/recommended-diagnostic.component';
import { AiAnalysisComponent } from './decision-support/ai-analysis/ai-analysis.component';
import { TpItemLenFilterPipe } from './pipe/tp-item-len-filter.pipe';
import { HistoryTrendComponent } from './decision-support/ai-analysis/components/history-trend/history-trend.component';
import { DangerRatingComponent } from './decision-support/ai-analysis/components/danger-rating/danger-rating.component';
import { ToPercentPipe } from './pipe/toPercent.pipe';
import { TransformUnderlinePipe } from './pipe/transform-underline.pipe';
import { TransformTimePipe } from './pipe/transform-time.pipe';
import { EarlyWaringFactorComponent } from './decision-support/ai-analysis/components/early-waring-factor/early-waring-factor.component';
import { DiseaseKnowledgeComponent } from './decision-support/disease-knowledge/disease-knowledge.component';
import { TreatmentCollapseComponent } from './decision-support/treatment-collapse/treatment-collapse.component';
import { CurrentViewComponent } from './current-view/current-view.component';
import { HistoryListComponent } from './current-view/history-list/history-list.component';
import { FeedbackModalComponent } from './decision-support/feedback-modal/feedback-modal.component';
import { DataLoadingComponent } from './decision-support/ai-analysis/components/data-loading/data-loading.component';

const COMPONENTS = [
  CDSSComponent,
  DecisionSupportComponent,
  CurrentVisitComponent,
  CurrentViewComponent,
  HistoryListComponent,
  TreatmentPlanComponent,
  ClinicalPathwayComponent,
  MedicalHistoryComponent,
  DiagnosisMonitorComponent,
  CollapseItemComponent,
  DiagnosisMonitorHistoryComponent,
  ConditionAnalysisComponent,
  CheckInspectionComponent,
  RecommendedDiagnosticComponent,
  AiAnalysisComponent,
  HistoryTrendComponent,
  DangerRatingComponent,
  EarlyWaringFactorComponent,
  DiseaseKnowledgeComponent,
  TreatmentCollapseComponent,
  FeedbackModalComponent,
  DataLoadingComponent,
];

const PIPES = [
  TransformRiskPipe,
  HtmlPipe,
  TpItemLenFilterPipe,
  TransformUnderlinePipe,
  TransformTimePipe,
  ToPercentPipe
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    ...COMPONENTS_NOROUNT,
  ],
  providers: [
    CDSSService,
    DecisionSupportService,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CDSSModule { }
