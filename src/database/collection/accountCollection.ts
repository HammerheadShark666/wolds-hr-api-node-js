import { RxCollection, RxDocument } from "rxdb";  
import { ApiAccount } from "../../interface/account";

export interface AccountDocMethods {}
export type AccountDocument = RxDocument<ApiAccount, AccountDocMethods>; 
export type AccountCollection = RxCollection<ApiAccount, AccountDocMethods, {}>;
