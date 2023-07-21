import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    private logger = new Logger();
    constructor(private authService: AuthService) { }

    @Post('signup')
    createUser(@Body() authCredentials: AuthCredentialsDTO): Promise<User> {
        return this.authService.signUp(authCredentials);
    }

    @Post('signin')
    signIn(@Body() authCredentials: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        this.logger.verbose(`Logging in as ${authCredentials.username}`)
        return this.authService.signIn(authCredentials);
    }
}
