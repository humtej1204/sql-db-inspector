export interface IGetTableRelationsByNameParams extends Record<string, any> {
  schema: string;
  table: string;
  database?: string;
}

export interface IFindValueAnywhereParams extends Record<string, any> {
  value: string;
  schema?: string;
  searchMode?: 'contains' | 'equals';
  database?: string;
}
