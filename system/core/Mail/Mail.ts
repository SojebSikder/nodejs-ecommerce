import nodemailer from "nodemailer";
import { mailConfig } from "../../../config/mail";

export class Mail {
  public static user = mailConfig.mailers.smtp.username;
  public static pass = mailConfig.mailers.smtp.password;
  public static host = mailConfig.mailers.smtp.host;
  public static port = mailConfig.mailers.smtp.port;

  // mail options
  public static from = mailConfig.from.address;
  // to: recepient
  public static recepient = "";
  // subject
  public static subjectText = "";
  // body
  public static bodyText = "";

  constructor() {}

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
      var transporter = nodemailer.createTransport({
        // service: "gmail",
        host: this.host,
        port: this.port,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      });

      var mailOptions = {
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
