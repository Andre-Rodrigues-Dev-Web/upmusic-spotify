import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  recentUploads = [
    { title: 'Summer Vibes', artist: 'DJ Cool', status: 'Live', streams: 12500 },
    { title: 'Midnight Rain', artist: 'LoFi Girl', status: 'Processing', streams: 0 },
    { title: 'Urban Jungle', artist: 'The City', status: 'Rejected', streams: 0 },
  ];
}
