import { Injectable, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class MinioService implements OnModuleInit {
  private s3: AWS.S3;

  onModuleInit() {
    this.s3 = new AWS.S3({
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      accessKeyId: process.env.MINIO_ROOT_USER,
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(
    bucket: string,
    key: string,
    fileBuffer: Buffer,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    await this.s3
      .createBucket({ Bucket: bucket })
      .promise()
      .catch((err) => {
        if (err.code !== 'BucketAlreadyOwnedByYou') throw err;
      });

    return this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
      })
      .promise();
  }
}
