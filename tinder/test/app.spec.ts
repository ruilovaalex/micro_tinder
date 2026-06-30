import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../api-gateway/src/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = moduleRef.get(AppController);
  });

  it('should return the gateway status message', () => {
    expect(appController.getHello()).toEqual({
      message: 'Tinder API Gateway running',
    });
  });
});
