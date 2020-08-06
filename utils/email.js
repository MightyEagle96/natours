const nodemailer = require('nodemailer');
const pug = require('pug');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const htmlToText = require('html-to-text');
const request = require('request');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mighty Eagle  <${process.env.EMAIL_FROM}>`;
    this.lastName = user.name.split(' ')[1];
  }
  newTransport() {
    if (process.env.NODE_ENV == 'production') {
      var options = {
        method: 'POST',
        url: 'https://api.sendinblue.com/v3/smtp/email',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key':
            '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',
        },
        body: {
          sender: { name: 'Mighty Eagle', email: 'mightyeaglecorp@gmail.com' },
          to: [{ email: this.to, name: `${this.firstName} ${this.lastName}` }],
          replyTo: { email: 'mightyeaglecorp@gmail.com', name: 'Mighty Eagle' },
          templateId: 2,
          params: { ORDER: 'f5ese' },
          contact: { FIRSTNAME: this.firstName, LASTNAME: this.lastName },
        },
        json: true,
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //send the actual email
    //1. Render HTML based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };
    //3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send(`Welcome`, 'Welcome to the natours family!');
  }
  async sendPasswordReset() {
    await this.send(
      `passwordReset`,
      'Your password reset token (Valid for only 10 mins)'
    );
  }
};
