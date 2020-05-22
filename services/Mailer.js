const sendgrid = require('sendgrid');
const helper = sendgrid.mail;

const keys = require('../config/keys');

class Mailer extends helper.Mail {
  //arg[0] 'survey' model variables we intend to use
  //arg[1] string html for email template
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("atwood.morganj@gmail.com");
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    //intial formatting recipients
    this.recipients = this.formatAddresses(recipients);

    //Sendgrid helper.Mail method
    this.addContent(this.body);

    //click-tracking - identifies user
    this.addClickTracking();

    //add recipients to the email
    this.addRecipients();
  }

  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings)
  }

  async send() {
    const request = await this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    console.log(response);
    return response;

  }
}
module.exports = Mailer;