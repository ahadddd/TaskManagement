import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signup')
    createUser(@Body() authCredentials: AuthCredentialsDTO): Promise<User> {
        return this.authService.signUp(authCredentials);
    }

    @Post('signin')
    signIn(@Body() authCredentials: AuthCredentialsDTO): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentials);
    }
}
