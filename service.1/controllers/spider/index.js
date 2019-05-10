const goldSC = require('./goldSpiderController');
const newsSC = require('./newsSpiderController');
const db = require('../../mongodb/db');
const apiUrls = [
  'http://api.k780.com'
]
createGold();
async function createGold() {
  const gold = await goldSC.getGold(apiUrls[0]);
  if (gold) {
    const res = await goldSC.createGold(gold);
  } else {
    console.log('获取gold失败');
  }
}
