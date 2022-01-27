# filesrocket-s3
[Filesrocket](https://github.com/IvanZM123/filesrocket) service to manage your files and directories with [Amazon S3](https://aws.amazon.com/s3/) services.

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
We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.

| Framework | Repository |
| --------- | ---------- |
| Vue | [filesrocket-vue-app](https://github.com/IvanZM123/filesrocket-vue-app) |
| Angular | [filesrocket-angular-app](https://github.com/IvanZM123/filesrocket-angular-app) |
| React | [filesrocket-react-app](https://github.com/IvanZM123/filesrocket-react-app)|
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |
