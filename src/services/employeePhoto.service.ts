import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { ServiceResult } from '../types/ServiceResult';
import { UploadEmployeePhotoResponse } from '../interface/employee'; 
import { EmployeeModel } from '../models/employee.model';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

function generateUniqueFileName(originalName: string): string {
  return `${uuidv4()}${path.extname(originalName)}`;
}

function generateFileName(originalName: string): string {
  const extension = path.extname(originalName);
  return `${uuidv4()}${extension}`;
}

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'uploads';

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string not set in .env');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);


export async function uploadEmployeePhoto(fileBuffer: Buffer, uploadFileName: string, mimeType: string, id: string): Promise<ServiceResult<UploadEmployeePhotoResponse>> {

  console.log("uploadEmployeePhoto")

  var existingEmployee = await EmployeeModel.findById(id);  
  if (!existingEmployee) {  
    return {success: false, code: 404, error: ['Employee not found']};
  }   

  const originalFileName = existingEmployee.photo ?? "";

  const newFileName = generateFileName(uploadFileName);

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists({ access: 'container' });

  //const blobName = `${Date.now()}-${uploadFileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(newFileName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  }); 


  await EmployeeModel.findByIdAndUpdate(
            id,
            { $set: { photo: newFileName } },
            { new: true }
          );

  if(originalFileName != "") {
    const blockBlobClient = containerClient.getBlockBlobClient(originalFileName);

    const exists = await blockBlobClient.exists();
    if (!exists) {
      console.log(`Blob "${originalFileName}" not found in container "${CONTAINER_NAME}".`);
       
    }

    await blockBlobClient.delete();
  }
    

  const data: UploadEmployeePhotoResponse = { id: id, filename: newFileName}

  console.log("data", data)

  return { success: true, data: data };
} 