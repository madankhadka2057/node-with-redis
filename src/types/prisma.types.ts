export interface PaginateOptions {
    page?: number | string;
    limit?: number | string;
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
}

export interface MetaData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: MetaData;
}
