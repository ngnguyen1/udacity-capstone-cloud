import Axios from 'axios'

import { apiEndpoint } from '../config'
import { Doc } from '../types/Doc';
import { CreateDocRequest } from '../types/CreateDocRequest';
import { UpdateDocRequest } from '../types/UpdateDocRequest';

export async function getDocs(idToken: string): Promise<Doc[]> {
  console.log('Fetching docs ...')

  const response = await Axios.get(`${apiEndpoint}/docs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Docs: ', response.data)
  return response.data.items
}

export async function createDoc(
  idToken: string,
  newDoc: CreateDocRequest
): Promise<Doc> {
  const response = await Axios.post(`${apiEndpoint}/docs`,  JSON.stringify(newDoc), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchDoc(
  idToken: string,
  docId: string,
  updateDoc: UpdateDocRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/docs/${docId}`, JSON.stringify(updateDoc), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getDoc(
  idToken: string,
  docId: string
): Promise<Doc> {
  const response = await Axios.get(`${apiEndpoint}/docs/${docId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function deleteDoc(
  idToken: string,
  docId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/docs/${docId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  docId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/docs/${docId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
