import {
    generateRandomFilename,
    ServiceMethods,
    Paginated,
    Payload,
    Result,
    Query
  } from "filesrocket";
  import { NotFound } from "http-errors";
  
  import { AmazonConfig } from "./declarations";
  import { removeProperties } from "./utils";
  import { BaseAmazonRocket } from "./base";
  
export class AmazonRocketService extends BaseAmazonRocket implements Partial<ServiceMethods> {
  constructor(options: AmazonConfig) {
    super(options);
    this.createBucket(options.Bucket)
      .then(() => console.log("Your bucket was create successfully."))
      .catch(() => console.error("Your bucket already exist."));
  }
  
  async create(data: Payload, query: Query): Promise<Result> {
    const filename: string = generateRandomFilename(data.filename);
    const updatedQuery = removeProperties(query, ["service", "folder"]);

    const file = await this.s3.upload({
      ...updatedQuery,
      Bucket: query.Bucket || this.options.Bucket,
      Key: query.folder ? `${ query.folder }/${ filename }` : filename,
      Body: data.file
    }).promise();

    return this.builder(file, {
      Bucket: file.Bucket,
      Key: file.Key
    });
  }
  
  async list(query: Query): Promise<Paginated<Result & Query>> {
    const { Pagination } = this.options;
    const updatedQuery = removeProperties(query, [
      "service",
      "path",
      "page",
      "prevPage"
    ]);

    const paginate: number = query.size <= Pagination.max
    ? query.size
    : Pagination.default;

    const data = await this.s3.listObjectsV2({
      ...updatedQuery,
      Bucket: query.Bucket || this.options.Bucket,
      MaxKeys: paginate,
      Prefix: query.path,
      ContinuationToken: query.page,
      StartAfter: query.prevPage || '',
    }).promise();

    data.Contents = data.Contents?.map(item =>
      this.builder(item, {
        Bucket: query.Bucket || this.options.Bucket,
        Key: item.Key
      }) as any
    );

    return this.paginate(data);
  }
  
  async remove(path: string, query: Query): Promise<Result> {
    const data = await this.list({ path });
    if (!data.items.length) throw new NotFound("The file does not exist.");

    const updatedQuery = removeProperties(query, ["service", "path"]);
    const file = data.items[0];

    await this.s3.deleteObject({
      ...updatedQuery,
      Bucket: query.Bucket || this.options.Bucket,
      Key: file.Key
    }).promise();

    return file;
  }
}