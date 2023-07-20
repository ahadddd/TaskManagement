import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDTO } from "./DTO/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }


    async createUser(authCredentials: AuthCredentialsDTO): Promise<User> {
        const { username, password } = authCredentials;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`salt`, salt);
        console.log('Hashed password', hashedPassword);


        const user = this.userRepository.create({
            username: username,
            password: hashedPassword
        });

        try {
            await this.userRepository.save(user);
        }
        catch (error) {
            if (error.code === `23505`) {
                throw new ConflictException('Username already exists');
            }
            else {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    async signIn(authCredentials: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        const { username, password } = authCredentials;
        const user = await this.userRepository.findOne({ username });

        if (user && await (bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Re-enter your credentials.');
        }

    }


}