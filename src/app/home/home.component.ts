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

  onAddTask(addedTask: any){
    this.isPlaying = addedTask;
    this.tasks.unshift(addedTask)
  }

  onStopTask(){
    this.isPlaying = null;
  }
}
