import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './config';
import { PaginatedResult, PaginateOptions } from '../types/prisma.types';
import { DEFAULT_PAGE_SIZE } from './constants';

class PrismaManager {
  private static instance: any; // Use any to support extended client type

  private constructor() { }

  public static getInstance() {
    if (!PrismaManager.instance) {
      const connectionString = config.db.url;
      const pool: any = new Pool({ connectionString });
      const adapter: any = new PrismaPg(pool);

      const client = new PrismaClient({ adapter } as any);

      // Add Pagination Extension
      const extendedClient = client.$extends({
        model: {
          $allModels: {
            async paginate<T, A>(
              this: T,
              options: PaginateOptions = {}
            ): Promise<PaginatedResult<any>> {
              const {
                page = 1,
                limit = DEFAULT_PAGE_SIZE,
                where,
                orderBy,
                include,
                select,
              } = options;

              const p = Number(page) || 1;
              const l = Number(limit) || DEFAULT_PAGE_SIZE;
              const skip = (p - 1) * l;

              const [total, data] = await Promise.all([
                (this as any).count({ where }),
                (this as any).findMany({
                  where,
                  orderBy,
                  include,
                  select,
                  take: l,
                  skip: skip,
                }),
              ]);

              const totalPages = Math.ceil(total / l);

              return {
                data,
                meta: {
                  total,
                  page: p,
                  limit: l,
                  totalPages,
                  hasNext: p < totalPages,
                  hasPrev: p > 1,
                },
              };
            },
          },
        },
      });

      if (process.env.NODE_ENV === 'production') {
        PrismaManager.instance = extendedClient;
      } else {
        // Prevent multiple connections during hot-reload in development
        if (!(global as any).__prisma) {
          (global as any).__prisma = extendedClient;
        }
        PrismaManager.instance = (global as any).__prisma;
      }
    }
    return PrismaManager.instance;
  }
}

export const prisma = PrismaManager.getInstance();
