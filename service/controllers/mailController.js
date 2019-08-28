const nodemailer = require('nodemailer');
const mail = require('../config/mail');
const NumberUtil = require('../utils/numberUtil');
const userController = require('../controllers/userController');
// async..await is not allowed in global scope, must use a wrapper
class MailController {
    static async sendMail(to, code, subject = '验证码', from = mail.user) {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.163.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: mail.user, // generated ethereal user
                    pass: mail.auth_code // generated ethereal password
                }
            });
            const info = await transporter.sendMail({
                from,
                to,
                subject,
                text: `您的验证码是${code}`
            });
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info;
            
        } catch (err) {
            throw err;
        }
    }
    static async  sendCode(req, res) {
        const { body } = req;
        const code = NumberUtil.createFourNumber();
        try {
            if(body.email) {
                const info = await MailController.sendMail(body.email, code);
                await userController.updateCode(body.email, code);
                res.send({
                    status: true,
                    model: {
                        code,
                        info
                    },
                    message: '发送验证码成功',
                })
            } else {
                throw {
                    code: '请填写邮箱'
                }
            }
           
        } catch (err) {
            res.send({
                status: false,
                message: err.code,
            })
        }
    }
}
// {
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: 'bar@example.com, baz@example.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world?', // plain text body
//     html: '<b>Hello world?</b>' // html body
// }

module.exports = MailController;