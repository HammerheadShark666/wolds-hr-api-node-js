import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { ServiceResult } from '../types/ServiceResult';
import { UploadEmployeePhotoResponse } from '../interface/employee'; 
import { EmployeeModel } from '../models/employee.model';
import { generateFileName } from '../utils/file.helper';
import { uploadPhotoToAzureStorage } from '../utils/azureStorage.helper';  
import { AZURE_STORAGE_ERRORS, EMPLOYEE_ERRORS, GENERAL_ERRORS } from '../utils/constants';
 
dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || '';

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(AZURE_STORAGE_ERRORS.CONNECTION_STRING_NOT_FOUND);
}

if (!CONTAINER_NAME) {
  throw new Error(AZURE_STORAGE_ERRORS.CONTAINER_NOT_FOUND);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
 
export async function uploadEmployeePhoto(fileBuffer: Buffer, uploadFileName: string, mimeType: string, id: string): Promise<ServiceResult<UploadEmployeePhotoResponse>> {
  
  const existingEmployee = await EmployeeModel.findById(id);  
  if (!existingEmployee) {  
    return {success: false, code: 404, error: [EMPLOYEE_ERRORS.NOT_FOUND]};
  }   

  const currentFileName = existingEmployee.photo ?? "";
  const newFileName = generateFileName(uploadFileName);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);  

  try {
    await uploadPhotoToAzureStorage(containerClient, newFileName, fileBuffer, mimeType);
    await updateEmployeeRecord(id, newFileName);
    await deletePreviousPhoto(currentFileName, containerClient);
    
    const data: UploadEmployeePhotoResponse = { id: id, filename: newFileName} 

    return { success: true, data };
  } catch (err: any) {
    console.error('UploadEmployeePhoto error:', err);
    return { success: false, code: 500, error: [err.message || GENERAL_ERRORS.UPLOAD_FAILED] };
  }
} 

async function updateEmployeeRecord(id: string, fileName: string) {
  await EmployeeModel.findByIdAndUpdate(
            id,
            { $set: { photo: fileName } },
            { new: true }
          );
}

async function deletePreviousPhoto(currentFileName: string, containerClient: ContainerClient) {

  if (!currentFileName) return;

  const blockBlobClient = containerClient.getBlockBlobClient(currentFileName);
  const exists = await blockBlobClient.exists();

  if (!exists) {
    console.log(`Blob "${currentFileName}" not found in container "${CONTAINER_NAME}".`);
    return;
  }

  await blockBlobClient.delete();
}