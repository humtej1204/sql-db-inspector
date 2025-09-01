import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { FindValueAnywhere } from './pages/find-value-anywhere/find-value-anywhere';
import { GetTablesRelations } from './pages/get-tables-relations/get-tables-relations';
import { ListAllTables } from './pages/list-all-tables/list-all-tables';
import { ListBaseTables } from './pages/list-base-tables/list-base-tables';

export const routes: Routes = [
  { path: '', redirectTo: 'find-value-anywhere', pathMatch: 'full' },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'find-value-anywhere', component: FindValueAnywhere },
      { path: 'list-tables', component: ListAllTables },
      { path: 'list-base-tables', component: ListBaseTables },
      { path: 'get-tables-relations', component: GetTablesRelations },
    ],
  },
  { path: '**', redirectTo: 'find-value-anywhere' },
];
