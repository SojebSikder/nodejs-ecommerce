import fs from "fs/promises";
import fs_sync from "fs";
import { Command } from "./core";
import { StringHelper } from "./helper/StringHelper";

const controller_path = "app/controllers";
const model_path = "app/models";
/**
 * App console command. Reserved for app
 * @class AppCommand
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class AppCommand {
  /**
   * parse file name from path
   * @param path
   * @returns
   */
  public static parseFileNameFromPath(path) {
    return path.split("/").pop();
  }

  /**
   * execute command
   */
  public static execute() {
    /**
     * Predefined Command
     */
    Command.set("ask", function () {
      Command.ask(function (rl) {
        rl.question("What is your name ", function (name) {
          Command.success(`Hello ${name}`);
          rl.question("what is your age ", function (age) {
            Command.success(`${name} You are ${age} years old`);
            rl.close();
          });
        });
      });
    })
      .describe("Example command")
      .usage("ask");

    /**
     * Display application version
     */
    Command.set("-v", function () {
      const pkg = require("../package.json");
      Command.success(`Version: ${pkg.version}`);
    });

    /**
     * Create Controller and service together
     */
    Command.set("make:module", async function () {
      try {
        const name = Command.args(3);

        // directory firsy
        if (!fs_sync.existsSync(`${controller_path}/${name}`)) {
          fs_sync.mkdirSync(`${controller_path}/${name}`, { recursive: true });
        }

        // create controller file
        await fs.writeFile(
          `${controller_path}/${name}/${name}.controller.ts`,
          AppCommand.createController(AppCommand.parseFileNameFromPath(name))
        );
        // create service file
        await fs.writeFile(
          `${controller_path}/${name}/${name}.service.ts`,
          AppCommand.createService(AppCommand.parseFileNameFromPath(name))
        );
        // response
        Command.success(
          `${AppCommand.parseFileNameFromPath(name)} module created succesfully`
        );
      } catch (err) {
        Command.danger(err);
      }
    })
      .describe("Create Controller and service together")
      .usage("make:module [module_Name]");

    /**
     * Create eloqount Model
     */
    Command.set("make:model", async function () {
      try {
        const name = Command.args(3);
        await fs.writeFile(
          `${model_path}/${name}.ts`,

          AppCommand.createModel(AppCommand.parseFileNameFromPath(name))
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(name)} model created succesfully`
        );
      } catch (err) {
        Command.danger(err);
      }
    })
      .describe("Create eloqount model")
      .usage("make:model [model_Name]");

    /**
     * Create Controller
     */
    Command.set("make:controller", async function () {
      try {
        const name = Command.args(3);
        await fs.writeFile(
          `${controller_path}/${name}.ts`,

          AppCommand.createController(AppCommand.parseFileNameFromPath(name))
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            name
          )} controller created succesfully`
        );
      } catch (err) {
        Command.danger(err);
      }
    })
      .describe("Create controller")
      .usage("make:controller [controller_Name]");

    /**
     * Create Service
     */
    Command.set("make:service", async function () {
      try {
        const name = Command.args(3);
        await fs.writeFile(
          `${controller_path}/${name}.ts`,

          AppCommand.createService(AppCommand.parseFileNameFromPath(name))
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            name
          )} service created succesfully`
        );
      } catch (err) {
        Command.danger(err);
      }
    })
      .describe("Create service")
      .usage("make:service [service_name]");

    /**
     * list
     */
    Command.set("list", function () {
      const cmd = Command.customCmdArray;
      const desc = Command.description;
      const usage = Command.usageInfo;
      Command.comment("Available commands");

      let i = 0;
      for (const key in cmd) {
        i++;
        if (key in Command.description && key in Command.usage) {
          console.log(
            `${i}) ${key} ---------- ${Command.description[key]} ------ ${Command.usage[key]}\n`
          );
        } else if (key in Command.description) {
          console.log(`${i}) ${key} ---------- ${Command.description[key]}\n`);
        } else if (key in Command.usage) {
          console.log(`${i}) ${key} ------ ${Command.usage[key]} \n`);
        } else {
          console.log(`${i}) ${key}\n`);
        }
      }
    })
      .describe("Displays command list")
      .usage("list");

    /**
     * Display Help
     */
    if (process.argv[2]) {
      if (process.argv[2] == "help") {
        if (process.argv[3]) {
          Command.comment("Description:");
          console.log(`${Command.description[process.argv[3]]}\n`);
          Command.comment("Usage:");
          if (process.argv[3] in Command.usage) {
            console.log(`${Command.usage[process.argv[3]]}\n`);
          } else {
            console.log(`${process.argv[3]}\n`);
          }
        } else {
          Command.comment("Description:");
          console.log(`Diplays help for a command\n`);
          Command.comment("Usage:");
          console.log(`help [tropic]\n`);
        }
      }
    }
  }

  /**
   * create eloqount model command
   */
  public static createModel(modelName) {
    modelName = StringHelper.cfirst(`${modelName}`);
    const data = `import { ORM } from "../../system/core/ORM";

export class ${modelName} extends ORM{
  // define custom table name like this:
  // constructor() {
  //   super("table_name");
  // }
}
 
 `;
    return data;
  }

  /**
   * create controller command
   */
  public static createController(controllerName) {
    controllerName = StringHelper.cfirst(`${controllerName}Controller`);
    const data = `import { Request, Response } from "express";

export class ${controllerName}{
  /**
   * show all data
   * @param req
   * @param res
   */
  async index(req: Request, res: Response) {
    res.send("Hello world");
  }
}
 
 `;
    return data;
  }

  /**
   * create service command
   */
  public static createService(serviceName) {
    serviceName = StringHelper.cfirst(`${serviceName}Service`);
    const data = `import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class ${serviceName} {
  private static _instance: ${serviceName};
  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  /**
   * show all data
   */
  public async index() {
    const result = await prisma.post.findMany();
    return result;
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(arg_id: string) {
    const id = arg_id;
    const result = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
    });
    return result;
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store(req: Request, res: Response) {
    const title = req.body.title;
    const content = req.body.content;

    const user = Auth.userByCookie(req.signedCookies);

    const post = {
      title: title,
      content: content,
      authorId: user.userid,
    };

    const result = await prisma.post.create({
      data: post,
    });
  }
}
 `;
    return data;
  }
}
