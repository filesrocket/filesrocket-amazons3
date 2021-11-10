import { Paginated, Query, Result } from "filesrocket";
import S3 from "aws-sdk/clients/s3";
import { parse } from "path";

import { AmazonConfig, ParamsUrl, Operation } from "./declarations";

export class BaseAmazonRocket {
  protected s3: S3;

  constructor(protected readonly options: AmazonConfig) {
    this.s3 = new S3(options);
  }

  async createBucket(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.createBucket({ Bucket: name }, (err, data) => {
        if (!data?.Location || err) return reject(err);
        resolve(data.Location);
      });
    });
  }

  paginate(data: S3.ListObjectsV2Output): Paginated<Result> {
    const { Pagination } = this.options;
    const items: any = data.Contents?.map(item => this.builder(item, {
      Bucket: data.Name,
      Key: item.Key
    }));

    return {
      items,
      size: data.KeyCount || Pagination.default,
      total: data.KeyCount as number,
      pageToken: data.ContinuationToken || null,
      nextPageToken: data.NextContinuationToken || null,
      prevPageToken: null
    };
  }

  generateUrl(operation: Operation, params: Partial<ParamsUrl>): string {
    const Bucket: string = this.options.Bucket;
    return this.s3.getSignedUrl(operation, { Bucket, ...params });
  }

  builder(payload: S3.Object, query: Partial<ParamsUrl>): Result & Query {
    const { ext, base: name, dir } = parse(payload.Key as string);
    
    return {
      ...payload,
      name,
      dir,
      ext,
      size: payload.Size as number,
      url: this.generateUrl("getObject", query),
      createdAt: new Date(payload.LastModified as Date),
      updatedAt: new Date(payload.LastModified as Date)
    }
  }
}
