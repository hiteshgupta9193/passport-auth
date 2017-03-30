const nodemailer = require("nodemailer");
const mailerConf = require('./config.js').nodemailer;

const smtpTransport = nodemailer.createTransport("SMTP",{
    service: mailerConf.service,
    auth: {
        user: mailerConf.username,
        pass: mailerConf.password
    }
});

module.exports = smtpTransport;