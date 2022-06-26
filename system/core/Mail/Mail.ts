import nodemailer from "nodemailer";
import { mailConfig } from "../../../config/mail";

/**
 * Mail abstraction top of nodemailer. Using Mail class Send email
 * @class Mail
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 * @example
 * const mail = Mail.to("example@email.com")
 *  .subject("My subject")
 *  .body("My body")
 *  .send();
 */
export class Mail {
  public static host = mailConfig.mailers.smtp.host;
  public static port = mailConfig.mailers.smtp.port;
  public static user = mailConfig.mailers.smtp.username;

  public static accessToken = mailConfig.mailers.smtp.accessToken;
  public static clientId = mailConfig.mailers.smtp.clientId;
  public static clientSecret = mailConfig.mailers.smtp.clientSecret;

  // mail options
  public static from = mailConfig.from.address;
  // to: recepient
  public static recepient = "";
  // subject
  public static subjectText = "";
  // body
  public static bodyText = "";

  /**
   * Mail recepient
   * @param recepient
   */
  public static to(recepient: string) {
    this.recepient = recepient;
    return this;
  }
  /**
   * mail subject
   * @param subjectText
   */
  public static subject(subjectText: string) {
    this.subjectText = subjectText;
    return this;
  }
  /**
   * mail body
   * @param bodyText
   */
  public static body(bodyText: string) {
    this.bodyText = bodyText;
    return this;
  }
  /**
   * send mail
   */
  public static send() {
    try {
      let transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        host: this.host,
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: this.user,
          accessToken: this.accessToken,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
        },
      });

      const mailOptions = {
        from: this.from,
        to: this.recepient,
        subject: this.subjectText,
        text: this.bodyText,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return error;
        } else {
          return true;
        }
      });
    } catch (error) {
      return error;
    }
  }
}
