import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from './stores/global-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Front');

  constructor(private readonly globalStore: GlobalStore) {}

  ngOnInit(): void {
    this.globalStore.setNewTableList();
    this.globalStore.setNewSQLDatabasesList();
  }
}
