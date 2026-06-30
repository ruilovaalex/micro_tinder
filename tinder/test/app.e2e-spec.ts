import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from '../../api-gateway/src/app.module';
import { RpcClientsBootstrapService } from '../../api-gateway/src/rpc/rpc-clients.bootstrap';

describe('API Gateway (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RpcClientsBootstrapService)
      .useValue({
        onApplicationBootstrap: async () => undefined,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Tinder API Gateway running' });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
