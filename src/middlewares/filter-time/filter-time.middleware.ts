import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const validFilters = ['3M', '6M', '1YR'];

@Injectable()
export class FilterTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const filterParam = req.query.filter;
    if (!validFilters.includes(filterParam as string)) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'invalid filter value' });
    }
    next();
  }
}
