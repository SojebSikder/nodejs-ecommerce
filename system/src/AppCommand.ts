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
      const pkg = require("../../package.json");
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

        let filename = name.split("/").pop();

        // create controller file
        await fs.writeFile(
          `${controller_path}/${name}/${filename}.controller.ts`,
          AppCommand.createController(
            AppCommand.parseFileNameFromPath(filename)
          )
        );
        // create service file
        await fs.writeFile(
          `${controller_path}/${name}/${filename}.service.ts`,
          AppCommand.createService(AppCommand.parseFileNameFromPath(filename))
        );
        // response
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            filename
          )} module created succesfully`
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

        let filename = name.split("/").pop();

        await fs.writeFile(
          `${model_path}/${filename}.ts`,

          AppCommand.createModel(AppCommand.parseFileNameFromPath(filename))
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            filename
          )} model created succesfully`
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

        let filename = name.split("/").pop();
        await fs.writeFile(
          `${controller_path}/${name}.ts`,

          AppCommand.createController(
            AppCommand.parseFileNameFromPath(filename)
          )
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            filename
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

        let filename = name.split("/").pop();
        await fs.writeFile(
          `${controller_path}/${name}.ts`,

          AppCommand.createService(AppCommand.parseFileNameFromPath(filename))
        );
        Command.success(
          `${AppCommand.parseFileNameFromPath(
            filename
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
    const data = `import { ORM } from "../../system/src/core/ORM";

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
  public static createController(name) {
    const module = name;
    const controllerName = StringHelper.cfirst(`${name}Controller`);
    const serviceName = StringHelper.cfirst(`${name}Service`);

    const data = `import { Request, Response } from "express";
import { Controller, Delete, Get, Patch, Post } from "../../../system/src/core/decorator";
import { ${serviceName} } from "./${module}.service";
    
@Controller("/${module}/")
export class ${controllerName} {
  //
  @Post()
  async create(req: Request, res: Response) {
    res.send(await ${serviceName}.getInstance().create(req.body));
  }

  @Get()
  async findAll(req: Request, res: Response) {
    res.send(await ${serviceName}.getInstance().findAll());
  }

  @Get(':id')
  async findOne(req: Request, res: Response) {
    res.send(await ${serviceName}.getInstance().findOne(req.params.id));
  }

  @Patch(':id')
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    res.send(await ${serviceName}.getInstance().update(id, data));
  }

  @Delete(':id')
  async remove(req: Request, res: Response) {
    res.send(await ${serviceName}.getInstance().remove(req.params.id));
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

  create(data: any){
    return 'This action adds a new user';
  }

  findAll() {
    return 'This action returns all user';
  }

  findOne(id: string) {
    return 'This action returns a {id} user';
  }

  update(id: string, data: any) {
    return 'This action updates a {id} user';
  }

  remove(id: string) {
    return 'This action removes a {id} user';
  }
}
 `;
    return data;
  }
}
