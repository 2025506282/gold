export interface DecisionSupportItem {
  typeLevel1Name: string;
  typeLevel1: string;
  actions: ActionItem[];
}

export interface ActionItem {
  typeLevel: string;
  typeLevelName: string;
  typeContent: TypeContentItem[];
  children: Child[];
}

export interface Child {
  typeLevel: string;
  typeLevelName: string;
  content: ContentItem[];
  typeContent: TypeContentItem[];
}

interface ContentItem {
  code: string;
  name: string;
  isNew?: boolean;
}

export interface TypeContentItem {
  actionId: any;
  color: string;
  colorName: string;
  ruleLevel: string;
  ruleLevelName: string;
  titleContent: string | null;
  abstractContent: string | null;
  materialLink: string | null;
  linkKey: string | null;
  description: string | null;
  content: ContentItem[];
  displayType?: string;
  extFlag2: string;
  extFlag1: string;
}

export interface MedicalHistory {
  patientName: string;
  age: number;
  ageUnit: string;
  sex: string;
  medicalRecordNumber: string;
  medicalHistoryItems: Array<{ medicalHistoryName: string; medicalHistoryValue: string; }>;
  medicalRecordItems: MedicalRecordItem[];
}

export interface MedicalHistory {
  patientName: string;
  age: number;
  ageUnit: string;
  sex: string;
  medicalRecordNumber: string;
  medicalHistoryItem: { medicalHistoryName: string; medicalHistoryValue: string; };
  medicalRecordItems: MedicalRecordItem[];
}

interface MedicalHistoryItem {
  medicalHistoryName: string;
  medicalHistoryValue: string;
}

interface MedicalRecordItem {
  visitTime: string;
  domainInfoItems: DomainInfoItem[];
}

interface DomainInfoItem {
  domainName: string;
  variableInfoItems: Array<{ variableName: string; variableValue: string }>;
}

export interface AiModelBasis {
  patient: {
    name: string,
    sex: string,
    visitId: string,
  };
  aiModel: {
    name: string,
    modelType: string,
    explain: string,
    score: number,
    obsTime: string,
    version: string,
    scaleArray: ScaleItem[],
    literature: LiteratureItem[],
    variable: KeyVariableItem[],
  };
}

export interface ScaleItem {
  name: string;
  scale: number;
}

export interface KeyVariableItem {
  name: string;
  exit: boolean;
  tips: string;
}

export interface BasisItem {
  id: number | string;
  name: string;
  window: string;
  way: string;
  unit: string;
  value: string;
  originVal: string;
  time: string;
  source: string;
  weight: number;
}

export interface LiteratureItem {
  id: string;
  name: string;
  url: string;
}

export interface HistoryTrendIten {
  obsTime: string;
  score: number;
  tip: string;
  modelVersion: string;
}

export enum NewInfoType {
  NoInfo = '',
  DMInfo = '.diagnosis-monitor',
  RDInfo = '.recommended-diagnostic',
  IEInfo = '.illness-evaluate',
  CIInfo = '.check-inspection',
  TPInfo = '.treatment-plan',
  JBInfo = '.disease-knowledge',
}

export interface NewInfo {
  type: NewInfoType;
  count: number;
}

export enum DataStatus {
  LOADING = 0,  // 数据加载中
  NORMAL,       // 加载成功且有数据
  NODATA,       // 加载成功但是无数据
  ERROR,        // 加载失败
}

export enum FunctionCategory {
  CDSSMinimize = 0,
  CDSSMaximize,
  DiagnosisMonitor,
  RecommendedDiagnostic,
  ConditionAnalysis,
  CheckInspection,
  TreatmentPlan,
  L1Literature,
  L2Literature,
  DiseaseKnowledge,
  ClinicalKnowledge
}

export enum EventCategory {
  Min = '点击“展开”按钮',
  Max = '点击“收起”按钮',
  ToDiagnosisHistory = '点击“历史”按钮',
  ClickQuote = '点击“引用”按钮',
  ClickHistoryTrendEcharts = '趋势图中，点击节点',
  ClickLiterature = '点击素材链接',
  CloseAi = '关闭AI评估',
  ToPredictResult = '点击前往查看最新一次预测结果',
  ToDetail = '点击“详情”按钮',
  ToClinicalKnowledge = '点击“诊疗知识库”按钮',
}

export enum EventLocation {
  SideBar = 'SideBar',
  AiDetail = 'AI-详情页',
}
