import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { Types } from "aws-sdk/clients/s3"

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('DocsAccess')

export class AttachmentUtils {
  private s3: Types
  private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET
  private readonly expires: number = parseInt(process.env.SIGNED_URL_EXPIRATION)

  constructor() {
    this.s3 = new XAWS.S3({ signatureVersion: 'v4' })
  }

  public async createAttachmentPresignedUrl(attachmentId: string): Promise<string> {
    logger.info('create attachment presigned URL - ', attachmentId)
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.expires
    }) as string
  }
}