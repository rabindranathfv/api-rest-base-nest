import { Test, TestingModule } from '@nestjs/testing';
import { RecordCompanyController } from './record-company.controller';

describe('RecordCompanyController', () => {
  let controller: RecordCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordCompanyController],
    }).compile();

    controller = module.get<RecordCompanyController>(RecordCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
