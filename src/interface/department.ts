export interface BaseDepartment {
  id: string;
  name: string;
}

export interface ApiDepartment extends BaseDepartment {
  _meta: {
    lwt: number;
  };
  _deleted: boolean;
  _attachments: Record<string, unknown>;
  _rev: string;
}