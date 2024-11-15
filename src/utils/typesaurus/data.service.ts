/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from './db';
import { ListDto } from './dto/list.dto';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class DataService {
  constructor(private paginationService: PaginationService) {}

  async list(model: any, query: ListDto, isPagination = false) {
    const { page = 1, lastId, limit = 10, filterBy = [], orderBy } = query;
    const result = {
      results: [],
      limit: Number(`${limit}`),
      page: Number(`${page}`),
      totalPages: 0,
      totalResults: 0,
    };
    const $ = db[model].query.build();
    if (filterBy.length > 0) {
      for (const filter of filterBy) {
        const { type, field, value } = filter;
        switch (type) {
          case 'gt':
            $.field(field).gt(value);
            break;
          case 'gte':
            $.field(field).gte(value);
            break;
          case 'lt':
            $.field(field).lt(value);
            break;
          case 'lte':
            $.field(field).lte(value);
            break;
          case 'eq':
          default:
            $.field(field).eq(value);
            break;
        }
      }
    }
    if (`${isPagination}`.toLowerCase() === 'true') {
      if (orderBy) {
        const [field, direction] = orderBy.split(':');
        $.field(`${field}`).order(
          direction.toLowerCase() === 'desc' ? 'desc' : 'asc',
        );
      } else {
        $.field('createdAt').order('desc');
      }
      const dataRefs = await $.run();
      const data = [];
      for (const item of dataRefs) {
        data.push(item.data);
      }
      result.results = await this.paginationService.paginate(data, limit, page);
      result.totalResults = data.length;
      result.totalPages = Math.ceil(data.length / limit);
    } else {
      if (lastId) {
        const lastVisibleRef = await db[model].get(db[model].id(lastId));
        if (!lastVisibleRef) {
          throw new NotFoundException(`${model} not found`);
        }
        if (orderBy) {
          const [field, direction] = orderBy.split(':');
          $.field(`${field}`).order(
            direction.toLowerCase() === 'desc' ? 'desc' : 'asc',
            [$.startAfter(lastVisibleRef)],
          );
        } else {
          $.field('createdAt').order('desc', [$.startAfter(lastVisibleRef)]);
        }
      } else {
        if (orderBy) {
          const [field, direction] = orderBy.split(':');
          $.field(`${field}`).order(
            direction.toLowerCase() === 'desc' ? 'desc' : 'asc',
          );
        } else {
          $.field('createdAt').order('desc');
        }
      }
      $.limit(limit);
      const dataRefs = await $.run();
      const data = [];
      for (const item of dataRefs) {
        data.push(item.data);
      }
      result.results = data;
    }
    return result;
  }
}
