const axios = require("axios");
const body = [
  {
    patientId: 2480296,
    visitId: 101278421,
    tag: ""
  },
  {
    patientId: 3989982,
    visitId: 101282787
  }
];
axios.defaults.headers.post["Content-Type"] =
  "application/json-patch+json-patch+json";

setInterval(function() {
  axios
    .post("http://synyi-cdss-trigger-720-test.sy/api/Trigger", body)
    .then(res => {
      console.log(res);
    });
}, 1000*60);
