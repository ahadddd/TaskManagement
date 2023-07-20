import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) { }

    signUp(authCredentials: AuthCredentialsDTO): Promise<User> {
        return this.userRepository.createUser(authCredentials);
    }

    signIn(authCredentials: AuthCredentialsDTO): Promise<{accessToken: string}>{
        const {username, password} = authCredentials;
        return this.userRepository.signIn(authCredentials);
    }

}
