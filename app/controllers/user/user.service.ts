import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class UserService {
  private static _instance: UserService;
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
   * Process login
   * @param req
   * @param res
   */
  async login(emailField, passwordField) {
    try {
      const email = emailField;
      const password = passwordField;

      const user = await prisma.user.findFirst({
        where: {
          email: String(email),
        },
      });

      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
          // prepare the user object to generate token
          const userObject = {
            userid: user.id,
            username: user.username,
            email: user.email,
          };

          // generate token
          const token = Auth.generateAccessToken(userObject);
          // generate refresh token
          const refreshToken = Auth.generateRefreshAccessToken(userObject);

          return {
            statusCode: 200,
            data: userObject,
            token: token,
          };
        } else {
          return {
            statusCode: 401,
            message: "Invalid password",
          };
        }
      } else {
        return {
          statusCode: 401,
          message: "Email not found",
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error,
      };
    }
  }

  /**
   * Process register
   * @param req
   * @param res
   */
  register = async (nameField, emailField, passwordField) => {
    try {
      const name = nameField;
      const email = emailField;
      const hashedPassword = await bcrypt.hash(passwordField, 10);

      const user = {
        name: name,
        email: email,
        password: hashedPassword,
      };

      const result = await prisma.user.create({
        data: user,
      });

      return {
        statusCode: 201,
        message: "Account created successfully. Please login.",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error,
      };
    }
  };
}
