import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('refresh')
  refresh(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.refresh({ refreshToken });
  }
}
