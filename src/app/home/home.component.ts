import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  tasks: Task[] = [];
  isPlaying!: Task | null;

  constructor() {}

  ngOnInit() {
    this.isLoading = true;
  }

  onStartTask(task: any){
    this.isPlaying = task;
  }

  onStopTask(task: any){
    this.isPlaying = null;
    // on stop task .. add it to the tasks list.
    this.tasks.unshift(task);
  }
}
