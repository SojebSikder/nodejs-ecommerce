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
   */
  async login(emailField, passwordField) {
    try {
      const email = emailField;
      const password = passwordField;

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: String(email),
            },
            {
              username: String(email),
            },
          ],
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
          message: "User not found",
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
   */
  async register({ nameField, emailField, passwordField }) {
    try {
      const name = nameField;
      const email = emailField;
      const hashedPassword = await bcrypt.hash(passwordField, 10);

      const userEmailExist = await prisma.user.findFirst({
        where: {
          email: String(email),
        },
      });

      const userNameExist = await prisma.user.findFirst({
        where: {
          username: String(name),
        },
      });
      if (userEmailExist) {
        return {
          statusCode: 401,
          message: "Email already exist",
        };
      }
      if (userNameExist) {
        return {
          statusCode: 401,
          message: "Username already exist",
        };
      }

      const result = await prisma.user.create({
        data: {
          username: name,
          email: email,
          password: hashedPassword,
        },
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
  }
}
