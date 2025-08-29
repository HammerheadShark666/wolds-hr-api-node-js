import { Schema, model, Document, Types } from 'mongoose';

export interface IImportedEmployeeHistory extends Document {
  _id: Types.ObjectId;
  date: Date;
}

const ImportedEmployeeHistorySchema = new Schema<IImportedEmployeeHistory>({  
  _id: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now }
});

export const ImportedEmployeeHistoryModel = model<IImportedEmployeeHistory>('ImportedEmployeeHistory', ImportedEmployeeHistorySchema);