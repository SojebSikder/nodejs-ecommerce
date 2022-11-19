import { PrismaClient } from "@prisma/client";
import passport from "passport";
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const prisma = new PrismaClient();

export class AuthService {
  private static _instance: AuthService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  redirectToGoogleAuth() {
    return passport.authenticate("google", { scope: ["email", "profile"] });
  }

  googleAuthCallback() {
    return passport.authenticate("google", { session: false });
  }

  /**
   * Google strategy
   */
  googleStrategy(_passport) {
    _passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.GOOGLE_REDIRECT_URI}`,
          passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
          try {
            let existingUser = await prisma.user.findFirst({
              where: {
                providerId: profile.id,
              },
            });
            // if user exists return the user
            if (existingUser) {
              return done(null, existingUser);
            }
            // if user does not exist create a new user
            // Creating new user...
            const newUser = await prisma.user.create({
              data: {
                provider: "google",
                providerId: profile.id,
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                email: profile.emails[0].value,
                emailVerifiedAt: new Date().toISOString(),
              },
            });
            return done(null, newUser);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }
}
