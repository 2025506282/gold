import cdss_sdk from 'synyi-cdss-sdk'
var options = {
    cdssUrl: cdssUrl,
    scaleUrl: scaleUrl,
    citationUrl: citationUrl,
    patientId: patientId,
    visitId: visitId,
    deptId: deptId,
    deptName: deptName,
    userId: userId,
    userName: userName,
    userRole: userRole
};
cdss_sdk.InitOrStartCdss2()