const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: 'chet.breitenberg79@ethereal.email',
        pass: 'akj8xcT4U2MVx2NeAm'
    },
});

class SendMail {
// async..await is not allowed in global scope, must use a wrapper
    async funcSendmail(email) {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: email, // list of receivers
            subject: "change mật khẩu", // Subject line
            text: "change mật khẩu", // plain text body
            html: "<b>Mật khẩu reset cảu bạn là 123456789</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

}

module.exports = new SendMail;