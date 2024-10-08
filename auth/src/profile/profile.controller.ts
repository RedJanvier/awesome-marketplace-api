import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { User } from ".prisma/client";
import { ProfileService } from "./profile.service";
import { Auth } from "./decorators/auth.decorator";
import { GetUser } from "./decorators/get-user.decorator";
import { LoginDto, LoginResultDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import JwtRefreshGuard from "./guards/jwt-refresh.guard";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<string> {
    const res = await this.profileService.register(dto);
    return res;
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResultDto> {
    const { accessToken, refreshToken } = await this.profileService.login(dto);
    return new LoginResultDto(accessToken, refreshToken);
  }

  @Get("/refresh-token")
  @ApiSecurity("refresh")
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@GetUser() user: User): Promise<LoginResultDto> {
    const { accessToken, refreshToken } =
      await this.profileService.refreshToken(user);
    return new LoginResultDto(accessToken, refreshToken);
  }

  @Get("/verify")
  async verifyUser(@Query("token") token): Promise<LoginResultDto> {
    const { accessToken, refreshToken } = await this.profileService.verify(
      token,
    );
    return new LoginResultDto(accessToken, refreshToken);
  }

  @Get("/logout")
  @Auth()
  async logout(@GetUser() user: User): Promise<string> {
    await this.profileService.logout(user);
    return "Logged out successfully";
  }
}
