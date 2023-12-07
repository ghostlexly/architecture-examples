import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { HousekeepersService } from "src/models/housekeepers/housekeepers.service";
import * as bcrypt from "bcryptjs";

// -----------------------------------------------------------------------------
// This strategy is used to authenticate users based on the username and
// password submitted through a login form.
// -----------------------------------------------------------------------------

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  "housekeeper-local",
) {
  constructor(private housekeepersService: HousekeepersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.housekeepersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
