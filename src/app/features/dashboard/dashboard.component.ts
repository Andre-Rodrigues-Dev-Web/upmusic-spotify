import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private uploadService = inject(UploadService);
  faEllipsisVertical = faEllipsisVertical;

  releases = this.uploadService.releases;

  // Compute stats from releases
  getTotalStreams() {
    return this.releases().reduce((acc: number, current: any) => acc + current.streams, 0);
  }

  getActiveReleases() {
    return this.releases().filter((r: any) => r.status === 'Live').length;
  }
}
