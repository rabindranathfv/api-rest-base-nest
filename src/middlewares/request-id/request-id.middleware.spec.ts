import { NextFunction, Request, Response } from 'express';
import {
  RequestIdMiddleware,
  REQUEST_ID_HEADER,
} from './request-id.middleware';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;

  const requestMock = () => {
    const req: any = {};
    req.query = jest.fn().mockReturnValue(req);
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
    middleware = new RequestIdMiddleware();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call use method on RequestIdMiddleware', () => {
    const req = requestMock() as never as Request;
    const res = responseMock() as never as Response;
    const next = nextMock as never as NextFunction;
    middleware.use(req, res, next);

    expect(req[REQUEST_ID_HEADER]).toBeDefined();
    expect(res.set).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
