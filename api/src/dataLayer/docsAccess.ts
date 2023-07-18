import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { DocItem } from '../models/DocCreate'
import { DocUpdate } from '../models/DocUpdate';
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { createLogger } from '../utils/logger'
import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk');
const logger = createLogger('DocsAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class DocsAccess {
  private readonly docTable: string = process.env.DOCS_TABLE
  private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
  private readonly docsCreatedAtIndex = process.env.DOCS_CREATED_AT_INDEX
  private docDocument: DocumentClient

  constructor() {
    this.docDocument = new XAWS.DynamoDB.DocumentClient()
  }

  public async createDoc(doc: DocItem): Promise<DocItem> {
    logger.info("Add new doc")

    await this.docDocument.put({
      TableName: this.docTable,
      Item: doc
    }).promise()
    logger.info(`created ${doc.title}!!`)
    return doc
  }

  public async createAttachmentPresignedUrl(userId: string, docId: string, attachmentId: string) {
    const attachmentUtil = new AttachmentUtils()
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`

    if (userId) {
      await this.docDocument.update({
        TableName: this.docTable,
        Key: {
          docId, userId
        },
        UpdateExpression: "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl"
        },
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
        }
      }).promise()

      logger.info(`Url ${await attachmentUtil.createAttachmentPresignedUrl(attachmentId)}`)
      return await attachmentUtil.createAttachmentPresignedUrl(attachmentId)
    } else {
      logger.error("Unauthenticated")
    }
  }

  public async getDocs(userId: string) : Promise<DocItem[]> {
    if (userId) {
      logger.info(`Get docs for user ${userId}`)
      const docs = await this.docDocument.query({
        TableName: this.docTable,
        IndexName: this.docsCreatedAtIndex,
        KeyConditionExpression: "#userId = :userId",
        ExpressionAttributeNames: {
          "#userId": "userId"
        },
        ExpressionAttributeValues: {
          ":userId": userId
        }
      }).promise()

      logger.info(`Query successfully ${docs.Items}`)
      return docs.Items as DocItem[]
    } else {
      logger.error(`Unauthenticated`)
    }
  }

  public async updateDoc(userId: string, docId: string, doc: DocUpdate) {
    logger.info(`Updating ${docId} ...`)
    
    if (userId) {
      await this.docDocument.update({
        TableName: this.docTable,
        Key: {
          docId,
          userId
        },
        // UpdateExpression: "set #title = :name, #dueDate = :dueDate, #done = :done",
        UpdateExpression: "set #title = :title",
        ExpressionAttributeNames: {
          "#title": "title"
        },
        ExpressionAttributeValues: {
          ":title": doc.title
        }
      }).promise()

      logger.info("Updated successfull ", doc)
    } else {
      logger.error(`Unauthenticated`)
    }
  }

  public async deleteDoc(userId: string, docId: string) {
    logger.info(`Delete a doc - ${docId}`)
    if (userId) {
      await this.docDocument.delete({
        TableName: this.docTable,
        Key: {
          docId,
          userId
        }
      }).promise()
      logger.info("Deleted!!")
    } else {
      logger.error("Unauthenticated")
    }
  }
}