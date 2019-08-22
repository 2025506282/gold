const spiderConfig = require('../config/spider.js');
class ConfigController {
    getSpiderType(req,res) {
        res.send({
            status: true,
            model: spiderConfig.spiderTypes
        })
    }
    getSpiderForm(req, res) {
        const { id } = req.body;
        if(id === 1) {
            res.send({
                status: true,
                model: spiderConfig.spiderGoldForm
            })
        } else if(id === 2) {
            res.send({
                status: true,
                model: spiderConfig.spiderNewsForm
            })
        } else {
            res.send({
                status: false,
            })
        }
    }

}
module.exports = new ConfigController();