import { Injectable, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AppError } from '../errors/Error';

@Injectable()
export class MinioService implements OnModuleInit {
  private s3: AWS.S3;

  onModuleInit() {
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.MINIO_ROOT_USER || '',
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
    });

    this.s3 = new AWS.S3({
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      credentials,
      s3ForcePathStyle: true,
    });

    this.ensureBucketExists(process.env.MINIO_BUCKET || 'epaper').catch(
      (error) => {
        throw error;
      },
    );
  }

  private async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const buckets = await this.s3.listBuckets().promise();
      const bucketExists = buckets.Buckets?.some(
        (bucket) => bucket.Name === bucketName,
      );

      if (!bucketExists) {
        await this.s3.createBucket({ Bucket: bucketName }).promise();
      }
    } catch (error) {
      throw new AppError('aws-minioService.ensureBucketExists', 500, error);
    }
  }

  async uploadFile(
    bucket: string,
    key: string,
    fileBuffer: Buffer,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    return this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
      })
      .promise();
  }
}
