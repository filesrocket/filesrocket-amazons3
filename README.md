# filesrocket-amazons3

[Filesrocket](https://github.com/filesrocket/filesrocket) service to manage your files with [Amazon S3](https://aws.amazon.com/s3) services.

## Install

```
npm i filesrocket-amazons3
```

## Usage

To use the service add the following content.

```ts
import { Filesrocket } from "filesrocket";
import { AmazonS3FileService } from "filesrocket-amazons3";

// Initialize filesrocket
const filesrocket = new Filesrocket();

// Setting service
const amazons3 = new AmazonS3FileService({
  Pagination: { default: 15, max: 50 },
  Bucket: "filesrocket",
  region: "<Your Region>",
  credentials: {
    accessKeyId: "<Your ACCESS_KEY>",
    secretAccessKey: "<Your SECRET_KEY>"
  }
});

// Register services
filesrocket.register("amazons3", amazons3)

// Recovering service
const service = filesrocket.service("amazons3")

// Recovering controller
const controller = filesrocket.controller("amazons3")
```

> **Note**: To use this service, you need to have an account, [enter](https://aws.amazon.com/s3) here and follow the steps.
