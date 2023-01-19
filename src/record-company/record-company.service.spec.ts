import { Test, TestingModule } from '@nestjs/testing';
import { RecordCompanyService } from './record-company.service';

describe('RecordCompanyService', () => {
  let service: RecordCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordCompanyService],
    }).compile();

    service = module.get<RecordCompanyService>(RecordCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
