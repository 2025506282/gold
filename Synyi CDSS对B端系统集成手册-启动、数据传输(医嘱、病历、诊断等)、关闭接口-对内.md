# 浏览器系统集成 CDSS 辅助诊疗系统接口文档

# 1 说明

该文档为浏览器系统对接 CDSS 的接口文档

# 2 环境要求

IE 浏览器版本要不小于 11，或其他常规浏览器，如谷歌浏览器

# 3 操作步骤

## 3.1 应用场景

1. 浏览器端系统启动 CDS 程序
2. 浏览器端系统关闭 CDS 程序
3. 数据传输(医嘱、病历、诊断等)
4. 回调

## 3.2 接口说明

### 3.2.1 启动 CDSS 程序和登录接口

- .接口名称： InitOrStartCdss2(cdssOptions);
- .参数说明：

| 参数名称    | cdssOptions |                         |          |                       |
| ----------- | ----------- | ----------------------- | -------- | --------------------- |
| 变量名称    | 变量类型    | 示例值                  | 是否必填 | 说明                  |
| cdssUrl     | string      | 'http://synyi-cdss'     | 是       | Cdss 前端页面路径     |
| scaleUrl    | string      | 'http://synyi-scale'    | 否       | 量表路径              |
| citationUrl | string      | 'http://synyi-citation' | 否       | 诊疗知识库路径        |
| patientId   | string      | 'F70896'                | 是       | 患者编号              |
| visitId     | string      | '5314C46396'            | 是       | 就诊号                |
| deptId      | string      | '9018'                  | 是       | 科室编号              |
| deptName    | string      | '呼吸内科门诊'          | 是       | 科室名称              |
| userId      | string      | '9018'                  | 是       | 用户编号              |
| userName    | string      | '张三'                  | 是       | 用户名称              |
| userRole    | string      | 'doctor'                | 是       | 可选值：nurse、doctor |

- 接口名称: InitOrStartCdss2(cdssOptions)
- 示例代码：

  1、启动 CDSS 和登录参考示例

       var cdssOptions = {
            cdssUrl: 'http://synyi-cdss',
            scaleUrl: 'http://synyi-scale',
            citationUrl: 'http://synyi-citation',
            patientId: 'F70896,
            visitId: '5314C46396',
            deptId: '9018',
            deptName: '呼吸内科门诊',
            userId: '9018',
            userName:'张三',
            userRole: 'doctor'
        };
        cdss_sdk.InitOrStartCdss2(cdssOptions);

### 3.2.2 关闭 CDSS 程序接口

- .接口名称：StopAndCloseCdss();
- .示例代码：

  1、关闭 CDSS 参考示例

```
    cdss_sdk.StopAndCloseCdss();
```

### 3.2.3 启动 CDSS 接口

- .接口名称：InitOrStartCdss(ptions);
- .参数说明：

| 参数名称    | options  |                            |          |                   |
| ----------- | -------- | -------------------------- | -------- | ----------------- |
| 变量名称    | 变量类型 | 示例值                     | 是否必填 | 说明              |
| cdssUrl     | string   | 'http://synyi-cdss.sy'     | 是       | Cdss 前端页面路径 |
| scaleUrl    | string   | 'http://synyi-scale.sy'    | 否       | 量表路径          |
| citationUrl | string   | 'http://synyi-citation.sy' | 否       | 诊疗知识库路径    |

- .示例代码：

1、初始化启动 CDSS 参考示例

```
    var options = {
         cdssUrl: 'http://synyi-cdss.sy',
         scaleUrl: 'http://synyi-scale.sy',
         citationUrl: 'http://synyi-citation.sy',
    };
    cdss_sdk.InitOrStartCdss(options);

```

### 3.2.4 在第三方程序需要调用 CDSS 辅助诊断插件的代码处，定制响应消息，调用 SendClinicalData 方法即可打开 CDSS 辅助诊断插件，显示提醒、辅助诊断、检查检验、用药推荐等结果的接口

- .接口名称：SendClinicalData(string accessToken, string operation, UserInfo userInfo, PatientInfo patientInfo, VisitInfo visitInfo, ClinicalData clinicalData);
- .参数说明：

| 参数名称     | accessToken  |                                                                                                                 |          |                                                                                                 |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| 变量名称     | 变量类型     | 示例值                                                                                                          | 是否必填 | 说明                                                                                            |
| accessToken  | string       | '777'                                                                                                           | 是       | 用户登录后会获取相应的 accessToken                                                              |
| operation    | string       | 'OrderEdit'                                                                                                     | 是       | operation 可以有 2 种值，Login 或者 OrderEdit。Login 用来登录；OrderEdit 会向 CDSS 发送门诊信息 |
| userInfo     | UserInfo     | {user_id : 'user0001',user_name :'user023',user_role : 'doctor',dept_code : '0102082',dept_name : '心导管室'}   | 是       | 用户信息                                                                                        |
| patientInfo  | PatientInfo  | {empi : '',patient_id : '105292',patient_name : '张三',age : '56',age_unit : '年',sex_code : 1,sex_name : '男'} | 是       | 患者信息                                                                                        |
| visitInfo    | VisitInfo    | {visit_id : '327224473',visit_type : 'O',}                                                                      | 是       | 就诊信息                                                                                        |
| clinicalData | ClinicalData | {}                                                                                                              | 是       | 临床数据                                                                                        |

| 参数名称  | UserInfo |          |          |                                            |
| --------- | -------- | -------- | -------- | ------------------------------------------ |
| 变量名称  | 变量类型 | 示例值   | 是否必填 | 说明                                       |
| user_id   | string   | '123'    | 是       | 用户 ID                                    |
| user_name | string   | 'test'   | 否       | 用户名                                     |
| user_role | string   | 'doctor' | 是       | operation 可以有 2 种值，doctor 或者 nurse |
| dept_code | string   | '123'    | 是       | 科室代码                                   |
| dept_name | string   | '急诊室' | 是       | 科室名称                                   |

| 参数名称     | PatientInfo |        |          |                                                                         |
| ------------ | ----------- | ------ | -------- | ----------------------------------------------------------------------- |
| 变量名称     | 变量类型    | 示例值 | 是否必填 | 说明                                                                    |
| empi         | string      | '123'  | 否       | 患者唯一编号                                                            |
| patient_id   | string      | 'test' | 是       | 患者编号                                                                |
| patient_name | string      | '张三' | 是       | 患者姓名                                                                |
| age          | number      | 22     | 是       | 患者年龄                                                                |
| age_unit     | string      | '1'    | 否       | 患者年龄单位可以有三种值：1 或者 2 或者 3，1 代表年，2 代表月，3 代表日 |
| sex_code     | string      | '1'    | 否       | 性别代码                                                                |
| sex_name     | string      | '男'   | 否       | 性别名称                                                                |

| 参数名称   | VisitInfo |          |          |                                          |
| ---------- | --------- | -------- | -------- | ---------------------------------------- |
| 变量名称   | 变量类型  | 示例值   | 是否必填 | 说明                                     |
| visit_id   | string    | 'B92000' | 是       | 就诊编号                                 |
| visit_type | string    | 'O'      | 否       | 就诊类型：P 体检，I 住院，O 门诊，E 急诊 |

| 参数名称             | ClinicalData                        |                    |          |                          |
| -------------------- | ----------------------------------- | ------------------ | -------- | ------------------------ |
| 变量名称             | 变量类型                            | 示例值             | 是否必填 | 说明                     |
| patient_diagnose     | List&lt;Diagnosis&gt;               | patientDiagnose    | 否       | 诊断信息                 |
| inpat_undrug_order   | List&lt;InpatUndrugOrder&gt; InpatU | inpatUndrugOrder   | 否       | 检验检查等非药物医嘱信息 |
| inpat_drug_order     | List&lt;InpatDrugOrder&gt;          | inpatDrugOrder     | 否       | 药物医嘱信息             |
| operation_record     | List&lt;OperationRecord&gt; InpatU  | operationRecord    | 否       | 手术信息                 |
| inpat_medical_record | List&lt;InpatMedicalRecord&gt;      | inpatMedicalRecord | 否       | 病程                     |

| 参数名称        | Diagnosis          |                |          |                |
| --------------- | ------------------ | -------------- | -------- | -------------- |
| 变量名称        | 变量类型           | 示例值         | 是否必填 | 说明           |
| diag_class_id   | number             | 2002           | 否       | 诊断类别编号   |
| diag_class_code | string             | '9'            | 是       | 诊断类别编码   |
| diag_class_name | string             | '门诊诊断'     | 是       | 诊断类别名称   |
| diag_id         | number             | 123            | 否       | 诊断编号       |
| diag_code       | string             | I'48.x0100S01' | 是       | 诊断编码       |
| diag_name       | string             | '心房颤动'     | 是       | 诊断名称       |
| diag_sycode_set | List&lt;string&gt; | ['sy123']      | 否       | 森亿诊断编码集 |
| is_primary      | boolean            | true           | 是       | 是否主要诊断   |

| 参数名称         | InpatUndrugOrder |                |          |                      |
| ---------------- | ---------------- | -------------- | -------- | -------------------- |
| 变量名称         | 变量类型         | 示例值         | 是否必填 | 说明                 |
| order_class_id   | number           | 20002          | 否       | 医嘱类别编号         |
| order_class_code | string           | '9 '           | 是       | 医嘱类别编码         |
| order_class_name | string           | '检验'         | 是       | 医嘱类别名称         |
| order_item_id    | number           | 123            | 否       | 医嘱编号（项目编号） |
| order_code       | string           | '0100S01'      | 是       | 医嘱代码             |
| order_name       | string           | '粪便常规(1) ' | 是       | 医嘱名称             |

| 参数名称       | InpatDrugOrder |                                  |          |              |
| -------------- | -------------- | -------------------------------- | -------- | ------------ |
| 变量名称       | 变量类型       | 示例值                           | 是否必填 | 说明         |
| drug_id        | number         | 20002                            | 否       | 药品编号     |
| drug_code      | string         | '11210090410'                    | 是       | 药品编码     |
| drug_name      | string         | ' 硫酸氢氯吡格雷(泰嘉)片(国基) ' | 是       | 药品名称     |
| once_dose      | number         | 75                               | 是       | 每次用量     |
| dose_unit_id   | number         | 123                              | 否       | 用量单位 ID  |
| dose_unit_code | string         | 'mg '                            | 是       | 用量单位编码 |
| dose_unit_name | string         | ' mg'                            | 是       | 用量单位名称 |
| frequency_id   | number         | 34575                            | 否       | 频次编号     |
| frequency_code | string         | 'qd'                             | 是       | 频次编码     |
| frequency_name | string         | 'qd'                             | 是       | 频次名称     |
| usage_id       | number         | 12312                            | 否       | 用法编号     |
| usage_code     | string         | 'ch'                             | 是       | 用法编码     |
| usage_name     | string         | '餐后'                           | 是       | 用法名称     |
| note           | string         | '出院/1500/'                     | 否       | 备注         |
| group_no       | string         | '88453943'                       | 否       | 成组序号     |

| 参数名称            | OperationRecord             |                                                                        |          |                    |
| ------------------- | --------------------------- | ---------------------------------------------------------------------- | -------- | ------------------ |
| 变量名称            | 变量类型                    | 示例值                                                                 | 是否必填 | 说明               |
| operation_record_id | string                      | '20002'                                                                | 否       | 手术记录编号       |
| source_operation_id | string                      | '714999-1-2'                                                           | 是       | 源系统手术记录编号 |
| operation_detail    | List&lt;OperationDetail&gt; | [{ operation_code :'78.6001', operation_name : '骨折内固定物取出术' }] | 是       | 手术详情           |
| operation_id        | number                      | 123                                                                    | 否       | 手术项目编号       |

| 参数名称       | OperationDetail |                      |          |              |
| -------------- | --------------- | -------------------- | -------- | ------------ |
| 变量名称       | 变量类型        | 示例值               | 是否必填 | 说明         |
| operation_code | string          | '78.6001'            | 是       | 手术代码     |
| operation_name | string          | '骨折内固定物取出术' | 是       | 手术名称     |
| operation_id   | number          | 123                  | 否       | 手术项目编号 |

| 参数名称                    | InpatMedicalRecord                   |                                                                                                                                                                                                                                                   |          |            |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| 变量名称                    | 变量类型                             | 示例值                                                                                                                                                                                                                                            | 是否必填 | 说明       |
| record_id                   | number                               | 78                                                                                                                                                                                                                                                | 否       | 病程标识号 |
| d58                         | string                               | ''                                                                                                                                                                                                                                                | '是'     | D58        |
| inpat_medical_record_detail | List&lt;InpatMedicalRecordDetail&gt; | [{ note_type :'' , chief_complaint : '', present_history : '', past_history :'', allergic_history :'' , family_history : '', marriage_childbearing_history : '', personal_history : '', laboratory_examination : '', preliminary_diagnosis : ''}] | 是       | 病程详情   |

| 参数名称                      | InpatMedicalRecordDetail |        |          |          |
| ----------------------------- | ------------------------ | ------ | -------- | -------- |
| 变量名称                      | 变量类型                 | 示例值 | 是否必填 | 说明     |
| note_type                     | string                   | ''     | 否       | 病历类型 |
| chief_complaint               | string                   | ''     | 否       | 主诉     |
| present_history               | string                   | ''     | 否       | 现病史   |
| past_history                  | string                   | ''     | 否       | 既往史   |
| allergic_history              | string                   | ''     | 否       | 过敏史   |
| family_history                | string                   | ''     | 否       | 家族史   |
| marriage_childbearing_history | string                   | ''     | 否       | 婚育史   |
| personal_history              | string                   | ''     | 否       | 个人史   |
| laboratory_examination        | string                   | ''     | 否       | 体格检查 |
| preliminary_diagnosis         | string                   | ''     | 否       | 初步诊断 |

- .示例代码：

  1、发送诊断数据示例

```
   var userInfo = {
      user_id: 'user0001',
      user_name: 'user0001123',
      user_role: 'doctor',
      dept_code: '01020802',
      dept_name: '心导管室',
    };
```

```
    var patientInfo = {
      empi: '',
      patient_id: '105292',
      patient_name: ' 张三三',
      age: 56,
      age_unit: '年',
      sex_code: 1,
      sex_name: '男',
    };
```

```
    var visitInfo = {
      visit_id: '327224473',
      visit_type: 'O',
    };
```

```
    var patientDiagnose = [{
      diag_class_code: '9',
      diag_class_name: '门诊诊断',
      diag_code: 'I48.x0100S01',
      diag_name: '心房颤动',
      is_primary: true
    }];
```

```
    var inpatUndrugOrder = [{
      order_class_code: '96',
      order_class_name: '检验',
      order_code: 'FB0101',
      order_name: '粪便常规(1)'
    }];
```

```
    var inpatDrugOrder = [{
      drug_code: '11210090410',
      drug_name: '硫酸氢氯吡格雷(泰嘉)片(国基)',
      once_dose: '75.0000',
      dose_unit_code: 'mg',
      dose_unit_name: 'mg',
      frequency_code: 'qd',
      frequency_name: 'qd',
      usage_code: 'ch',
      usage_name: '餐后',
      note: '出院/1500/',
      group_no: '88453943'
    }];
```

```
    var operationDetails = [{
      operation_code: '78.6001',
      operation_name: '骨折内固定物取出术'
    }];
```

```
    var operationRecord = [{
      source_operation_id: '714999-1-2',
      operation_detail: operationDetails
    }];
```

```
    var inpatMedicalRecordDetails = [{
      note_type: '',
      chief_complaint: '',
      present_history: '',
      past_history: '',
      allergic_history: '',
      family_history: '',
      marriage_childbearing_history: '',
      personal_history: '',
      laboratory_examination: '',
      preliminary_diagnosis: ''
    }];
```

```
    var inpatMedicalRecord = [{
      record_id: '',
      d58: '',
      inpat_medical_record_detail: inpatMedicalRecordDetails
    }];
```

```
    var clinicalData = {
      patient_diagnose: patientDiagnose,
      inpat_undrug_order: inpatUndrugOrder,
      inpat_drug_order: inpatDrugOrder,
      operation_record: operationRecord,
      inpat_medical_record: inpatMedicalRecord
    }

    cdss_sdk.SendClinicalData(this.accessToken, Operation.OrderEdit, userInfo, patientInfo, visitInfo, clinicalData);

```

### 3.2.5、监听 CDSS 发送过来的消息，并进行处理的接口

- .接口名称：AddMessageListener(message, data);
- .参数说明：

| 参数名称 | options  |              |          |                |
| -------- | -------- | ------------ | -------- | -------------- |
| 变量名称 | 变量类型 | 示例值       | 是否必填 | 说明           |
| message  | string   | 'quote'      | 是       | 监听的信息类型 |
| callback | function | function(){} | 是       | 执行的回调函数 |

- .示例代码：

1、监听 CDSS 发送的消息参考示例

```
    cdss_sdk.AddMessageListener('quote',function(res){
            console.log(res);
    })
```

## 3.3 对接步骤

1、在浏览器端 html 文件中引入 synyi-cdss-sdk.js

    <script src='synyi-cdss-sdk.js'></script>;

2、按照接口说明调用 CDSS 程序

例如:

```
     var cdssOptions = {
            cdssUrl: 'http://synyi-cdss',
            scaleUrl: 'http://synyi-scale',
            citationUrl: 'http://synyi-citation',
            patientId: 'F70896,
            visitId: '5314C46396',
            deptId: '9018',
            deptName: '呼吸内科门诊',
            userId: '9018',
            userName:'张三',
            userRole: 'doctor'
        };
      cdss_sdk.InitOrStartCdss2(cdssOptions);
```

## 3.4 部署文件

synyi-cdss-sdk.zip 文件
