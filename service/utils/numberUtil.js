class NumberUtil {
    static createFourNumber() {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
}
module.exports = NumberUtil;

