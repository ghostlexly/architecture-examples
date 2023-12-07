import { Strategy, VerifyCallback } from "passport-google-oauth20";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

// -----------------------------------------------------------------------------
// Login with Google
// More informations: https://dev.to/chukwutosin_/implement-google-oauth-in-nestjs-using-passport-1j3k
// and: https://docs.nestjs.com/recipes/passport
//
// You need to:
// - Enable OAuth consent screen in Google Cloud Platform -> APIs & Services -> OAuth consent screen
// - Create a new "OAuth 2.0 Client ID" in Google Cloud Platform -> APIs & Services -> Credentials
// -----------------------------------------------------------------------------

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  "housekeeper-google",
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://${process.env.DOMAIN_NAME}/api/oauth2/callback/google`,
      scope: ["email", "profile"],
    });
  }

  // Check the Authorization header for a valid JWT token and return the payload
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, name, emails, photos } = profile;

    const user = {
      id: id,
      email: emails[0].value,
      displayName: displayName,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
