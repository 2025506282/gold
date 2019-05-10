const moment = require('moment');
class TimeUtil {
  static transTime(timeDes) {
    let publish_time;
    let time;
    if (timeDes.indexOf('小时') !== -1) {
      time = Number(timeDes.split('小时')[0]);
      publish_time = new Date().getTime() - time * 60 * 60 * 1000;
    } else if (timeDes.indexOf('天') !== -1) {
      time = Number(timeDes.split('天')[0]);
      publish_time = new Date().getTime() - time * 60 * 60 * 24 * 1000;
    } else if (timeDes.indexOf('分') !== -1) {
      time = Number(timeDes.split('分')[0]);
      publish_time = new Date().getTime() - time * 60 * 1000;
    } else if (timeDes.indexOf('秒') !== -1) {
      time = Number(timeDes.split('秒')[0]);
      publish_time = new Date().getTime() - time * 1000;
    }
    console.log(moment(publish_time).format('YYYY MM DD HH:mm:ss'));
    return publish_time;
  }
}
module.exports = TimeUtil;

