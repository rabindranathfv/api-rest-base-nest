import { NextFunction, Request, Response } from 'express';
import { FilterTimeMiddleware } from './filter-time.middleware';

describe('FilterTimeMiddleware', () => {
  let middleware: FilterTimeMiddleware;

  const requestMock = (queryParams = {}) => {
    const req: any = {};
    if (Object.keys(queryParams).length > 0) {
      req.query = { ...queryParams };
    }
    req.params = jest.fn().mockReturnValue(req);
    req.body = jest.fn().mockReturnValue(req);
    return req;
  };

  const responseMock = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
  };

  const nextMock = jest.fn();

  beforeEach(() => {
    middleware = new FilterTimeMiddleware();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call use method on FilterTimeMiddleware with valid filter and searchText query params', () => {
    const validQueryFilter = { filter: '3M', searchText: 'Camilo' };
    const req = requestMock(validQueryFilter) as never as Request;
    const res = responseMock() as never as Response;
    const next = nextMock as never as NextFunction;
    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call use method on FilterTimeMiddleware with invalid filter and searchText query params', () => {
    const validQueryFilter = { filter: '4M', searchText: 'Camilo' };
    const req = requestMock(validQueryFilter) as never as Request;
    const res = responseMock() as never as Response;
    const next = nextMock as never as NextFunction;
    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it('should call use method on FilterTimeMiddleware with searchText query params', () => {
    const validQueryFilter = { searchText: 'Camilo' };
    const req = requestMock(validQueryFilter) as never as Request;
    const res = responseMock() as never as Response;
    const next = nextMock as never as NextFunction;
    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call use method on FilterTimeMiddleware with empty filter query params', () => {
    const req = requestMock({}) as never as Request;
    const res = responseMock() as never as Response;
    const next = nextMock as never as NextFunction;
    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
