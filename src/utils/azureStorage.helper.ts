import { ContainerClient } from '@azure/storage-blob';

export async function uploadPhotoToAzureStorage(containerClient: ContainerClient, filename: string, fileBuffer: Buffer, mimeType: string) {
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  }); 
}