import { Test, TestingModule } from '@nestjs/testing';
import { DiscographicsController } from './discographic.controller';

describe('DiscographicsController', () => {
  let controller: DiscographicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscographicsController],
    }).compile();

    controller = module.get<DiscographicsController>(DiscographicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
