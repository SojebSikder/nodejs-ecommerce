import nodemailer from "nodemailer";
import { MailOption } from "./Option";

// mail attachment option
type attachmentOption = {
  /**
   * field name
   */
  filename: string;
  /**
   * max upload file number
   */
  path: string;
};

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
  private static host;
  private static port;
  private static user;
  private static pass;
  private static secure;

  // mail options
  private static from;
  // to: recepient
  private static recepient = "";
  // subject
  private static subjectText = "";
  // body
  private static bodyText = "";
  // attachment
  private static _attachment;
  private static _isAttachment = false;

  /**
   * Mail configuration
   * @param config
   */
  public static config(config: MailOption) {
    if (config.connection.host) {
      this.host = config.connection.host;
    }
    if (config.connection.username) {
      this.user = config.connection.username;
    }
    if (config.connection.password) {
      this.pass = config.connection.password;
    }
    if (config.connection.port) {
      this.port = config.connection.port;
    }
    if (config.connection.from.address) {
      this.from = config.connection.from.address;
    }
    this.secure = config.connection.secure;
  }

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
   * send attachment with mail
   */
  public static attachment(attachments: attachmentOption[]) {
    this._isAttachment = true;
    this._attachment = attachments;
    return this;
  }

  /**
   * send mail
   */
  public static send(html = false) {
    try {
      let transporter = nodemailer.createTransport({
        host: this.host || "smtp.gmail.com",
        port: this.port || 465,
        secure: this.secure,
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

      // if attachment is set
      if (this._isAttachment) {
        Object.assign(mailOptions, {
          attachments: this._attachment,
        });
      }

      // send mail with defined transport object
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
