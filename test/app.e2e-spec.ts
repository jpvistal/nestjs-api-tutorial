import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile(); 

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(0);
    pactum.request.setBaseUrl(await app.getUrl());

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'jona@gmail.com',
      password: '123',
    }

    describe('Signup', () => {

      it('should throw if email is empty', () => { 
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => { 
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if no body is provided', () => { 
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should signup', () => { 
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });
      
    });

    describe('Signin', () => {

      it('should throw if email is empty', () => { 
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => { 
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if no body is provided', () => { 
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });

      it('should signin', () => { 
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});
    
    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});    

  });
  
});
