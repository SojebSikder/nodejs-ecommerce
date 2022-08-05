import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class RecoverPasswordService {
  private static _instance: RecoverPasswordService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async create({ email, code }) {
    const result = await prisma.ucode.create({
      data: {
        code: code,
        email: email,
      },
    });

    return result;
  }

  async recover({ password, code }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    // check if code exist
    const codeExist = await prisma.ucode.findFirst({
      where: {
        code: code,
      },
    });

    // if code exist then update password
    if (codeExist) {
      const result = await prisma.user.update({
        where: {
          email: codeExist.email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return result;
    } else {
      return false;
    }
  }
}
