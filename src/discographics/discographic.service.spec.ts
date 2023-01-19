import { Test, TestingModule } from '@nestjs/testing';
import { DiscographicsService } from './discographic.service';

describe('DiscographicsService', () => {
  let service: DiscographicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscographicsService],
    }).compile();

    service = module.get<DiscographicsService>(DiscographicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
