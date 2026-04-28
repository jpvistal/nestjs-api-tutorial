import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy  } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

type JwtPayload = {
    sub: number;
    email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(
        config: ConfigService, 
        private prisma: PrismaService
    ) {
        super({
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // req.user will be whatever we return here
    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        delete user.hash;
        return user;
    }    
}
