export interface Document {
  _id: string;
  title: string;
  content?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Doc<T extends string> = T extends "documents" ? Document : never;
