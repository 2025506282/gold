# 浏览器系统集成CDSS辅助诊疗系统接口文档

# 1 说明

该文档为浏览器系统对接CDSS的接口文档

# 2 环境要求

IE浏览器版本要不小于11，或其他常规浏览器，如谷歌浏览器

# 3 操作步骤

## 3.1 应用场景

1. 浏览器端系统启动CDS程序
2. 浏览器端系统关闭CDS程序

## 3.2 接口说明

### 3.2.1 启动CDSS程序和登录接口

- .接口名称： InitOrStartCdss2(cdssOptions);
- .参数说明：



| 参数名称 | cdssOptions |  | | |
| --- | --- | --- | --- | --- | --- |
| 变量名称 | 变量类型 | 示例值 | 是否必填 | 说明 |
| cdssUrl | string | 'http://synyi-cdss' | 是 | Cdss前端页面路径 |
| scaleUrl | string | 'http://synyi-scale' | 否 | 量表路径 |
| citationUrl | string | 'http://synyi-citation' | 否 | 诊疗知识库路径 |
| patientId | string | 'F70896' | 是 | 患者编号 |
| visitId | string | '5314C46396' | 是 | 就诊号 |
| deptId | string | '9018' | 是 | 科室编号 |
| deptName | string | '呼吸内科门诊' | 是 | 科室名称 |
| userId | string | '9018' | 是 | 用户编号 |
| userName | string | '张三' | 是 | 用户名称 |
| userRole | string | 'doctor' | 是 | 可选值：nurse、doctor |



- 接口名称: InitOrStartCdss2(cdssOptions)
- 示例代码：

   1、启动CDSS和登录参考示例

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

### 3.2.2 关闭CDSS程序接口

- .接口名称：StopAndCloseCdss();
- .示例代码：

    1、关闭CDSS参考示例
   
```
    cdss_sdk.StopAndCloseCdss();
```

## 3.3 对接步骤

1、在浏览器端html文件中引入synyi-cdss-sdk.js

    <script src='synyi-cdss-sdk.js'></script>;

2、按照接口说明调用CDSS程序

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


synyi-cdss-sdk.zip文件





