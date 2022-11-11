import readline, { ReadLine } from "readline";
import dotenv from "dotenv";
import { AppCommand } from "../../AppCommand";

// initialize dotenv
dotenv.config();
/**
 * Command Class
 * @class Command
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Command {
  public static customCmd;
  public static customCmdArray = [];
  public static description = [];
  public static usageInfo = [];
  public static _instance = null;

  /**
   * Command Promt Color
   */
  private static red = "\x1b[31m";
  private static green = "\x1b[32m";
  private static yellow = "\x1b[33m";
  private static blue = "\x1b[34m";
  private static white = "\x1b[37m";

  /**
   * Accass Command Prompt Arguments
   */
  public static args(args) {
    if (process.argv[args]) {
      return process.argv[args];
    } else {
      this.danger(`${args} no. argument not found`);
    }
  }
  /**
   * Set Custom Commands
   */
  public static set(command, callback) {
    this.customCmd = command;

    this.customCmdArray[this.customCmd] = this.customCmd;

    if (this.customCmdArray[this.customCmd] == process.argv[2]) {
      callback();
    }

    return this;
  }

  /**
   * Describe Commands
   */
  public static describe(des) {
    this.description[this.customCmd] = des;
    return this;
  }
  /**
   * Describe Commands usage
   */
  public static usage(des) {
    this.usageInfo[this.customCmd] = des;
    return this;
  }

  /**
   * Execute predefined command
   */
  public static execute() {
    /**
     * Predefined Command
     */
    AppCommand.execute();
  }

  /**
   * Output comment with color yellow
   */
  public static comment(text) {
    console.log(`${this.yellow}${text}\n${this.white}`);
  }

  /**
   * Output comment with color green
   */
  public static success(text) {
    console.log(`${this.green}${text}\n${this.white}`);
  }

  /**
   * Output comment with color red
   */
  public static danger(text) {
    console.log(`${this.red}${text}\n${this.white}`);
  }

  /**
   * Output comment with color white
   */
  public static line(text) {
    console.log(`${this.white}${text}\n${this.white}`);
  }

  /**
   * Output comment with color blue
   */
  public static info(text) {
    console.log(` ${this.blue} ${text}\n${this.white}`);
  }

  /**
   * Output comment
   */
  public static plain(text) {
    console.log(`${text}\n`);
  }

  /**
   * Get value from command prompt
   */
  public static ask(callback) {
    const rl: ReadLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    callback(rl);

    // rl.question(`${text}`, callback);
    rl.on("close", function () {
      process.exit(0);
    });
    return this;
  }
}
