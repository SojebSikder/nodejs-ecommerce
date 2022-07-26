import nodemailer from "nodemailer";
// import { mailConfig } from "../../../config/mail";
import { mailConfig } from "../../Config";

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
  private static host = mailConfig.mailers.smtp.host;
  private static port = mailConfig.mailers.smtp.port;
  private static user = mailConfig.mailers.smtp.username;
  private static pass = mailConfig.mailers.smtp.password;


  // mail options
  private static from = mailConfig.from.address;
  // to: recepient
  private static recepient = "";
  // subject
  private static subjectText = "";
  // body
  private static bodyText = "";

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
   * set credentials for sending email
   */
  public static setCredentials({ username, password }) {
    this.user = username;
    this.pass = password;
    return this;
  }
  /**
   * send mail
   */
  public static send(html = false) {
    try {
      // let transporter = nodemailer.createTransport({
      //   // host: "smtp.gmail.com",
      //   host: this.host,
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     type: "OAuth2",
      //     user: this.user,
      //     accessToken: this.accessToken,
      //     refreshToken: this.refreshToken,
      //     clientId: this.clientId,
      //     clientSecret: this.clientSecret,
      //   },
      // });
      let transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        host: this.host,
        port: 465,
        secure: true,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      });

      let mailOptions;

      if (html == true) {
        mailOptions = {
          from: this.from,
          to: this.recepient,
          subject: this.subjectText,
          html: this.bodyText,
        };
      } else {
        mailOptions = {
          from: this.from,
          to: this.recepient,
          subject: this.subjectText,
          text: this.bodyText,
        };
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return error;
        } else {
          console.log("mail sent");
          return true;
        }
      });
    } catch (error) {
      return error;
    }
  }
}
