import { Component, signal } from '@angular/core';
import { Terminal } from './components/terminal/terminal';

@Component({
  selector: 'app-root',
  imports: [Terminal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fake-terminal');
}
