# filesrocket-s3
[Filesrocket](https://github.com/IvanZM123/filesrocket) service to manage your files with [Amazon S3](https://aws.amazon.com/s3/) services.

## Install
```
npm i filesrocket-s3
```

## Usage
To use the service add the following content.

```ts
import { AmazonConfig, S3FileService } from "filesrocket-s3";

const options: AmazonConfig = {
  Pagination: { default: 15, max: 50 },
  Bucket: "filesrocket",
  region: "<Your Region>",
  credentials: {
    accessKeyId: "<Your ACCESS_KEY>",
    secretAccessKey: "<Your SECRET_KEY>"
  }
};

app.use(
  RocketRouter.forRoot({
    path: "storage",
    services: [
      { service: new S3FileService(options) }
    ]
  })
);
```

For interact with the files enter to the following enpoint.

**Files**: http://localhost:3030/storage/s3/files

> **Note**: To use this service, you need to have an account, [enter](https://aws.amazon.com/s3/) here and follow the steps.

## Examples
We have created this repository to help as an example guide.

| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |
