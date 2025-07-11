/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    // A unique salt is generated and added to the password before hashing.
    // This ensures that even if two users have the same password, their hashed values will be different.
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return 'User created successfully';
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  async refresh({
    refreshToken,
  }: {
    refreshToken: string;
  }): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.usersRepository.findOne({
        where: { username: payload.username },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { username: user.username },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
