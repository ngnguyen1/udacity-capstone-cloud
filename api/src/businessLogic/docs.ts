import { DocsAccess } from '../dataLayer/docsAccess'
import { CreateDocRequest } from '../requests/CreateDocRequest'
import { UpdateDocRequest } from '../requests/UpdateDocRequest'
import { createLogger } from '../utils/logger'
// TODO: add type for uuid
import * as uuid from 'uuid'

const logger = createLogger("DocsAccess")
const docAccessLayer = new DocsAccess()

export const createDoc = async (request: CreateDocRequest, userId: string) => {
  logger.info("Creating new doc")

  if (request) {
    const docId = uuid.v4()
    const createdAt = new Date().toISOString()
    return await docAccessLayer.createDoc({
      userId,
      docId,
      createdAt,
      ...request
    });
  } else {
    logger.error("Failed to create doc")
  }
}

export const createAttachmentPresignedUrl = async (userId: string, docId: string) => {
  const attachmentId = uuid.v4()
  logger.info("Create attachment presigned url")
  return await docAccessLayer.createAttachmentPresignedUrl(userId, docId, attachmentId)
}

export const getDocsForUser = async (userId: string) => {
  logger.info("Get list of docs for specific user")
  return await docAccessLayer.getDocs(userId)
}

export const updateDoc = async (userId: string, docId: string, request: UpdateDocRequest) => {
  logger.info("Updating doc")
  await docAccessLayer.updateDoc(userId, docId, request)
}

export const deleteDoc = async (userId: string, docId: string) => {
  logger.info("Delete a doc")
  await docAccessLayer.deleteDoc(userId, docId)
}