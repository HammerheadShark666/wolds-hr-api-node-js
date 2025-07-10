export interface AppDepartment {
  id: string;
  name: string;
}

// interface ApiDepartment {
//   id: string;
//   name: string;
//   _meta: {
//     lwt: number;
//   };
//   _deleted: boolean;
//   _attachments: Record<string, unknown>;
//   _rev: string;
// }


export interface NewDepartment {
  id: string;
  name: string;
}

export interface ApiDepartment extends NewDepartment {
  _meta: {
    lwt: number;
  };
  _deleted: boolean;
  _attachments: Record<string, unknown>;
  _rev: string;
}
