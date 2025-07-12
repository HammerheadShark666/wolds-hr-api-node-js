export interface BaseApi {
   _meta: {
    lwt: number;
  };
  _deleted: boolean;
  _attachments: Record<string, unknown>;
  _rev: string;  
}