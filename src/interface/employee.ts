export interface BaseEmployee {
  id: string;
  surname: string;
  firstName: string;
}

export interface ApiEmployee extends BaseEmployee {
  _meta: {
    lwt: number;
  };
  _deleted: boolean;
  _attachments: Record<string, unknown>;
  _rev: string;
}