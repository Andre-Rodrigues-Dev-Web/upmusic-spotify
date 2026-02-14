import { Injectable, signal } from '@angular/core';
import { Observable, timer, map, takeWhile, finalize } from 'rxjs';

export interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  fileName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // Using Signals for state management
  uploadState = signal<UploadState>({ progress: 0, status: 'idle' });

  simulateUpload(file: File): Observable<number> {
    this.uploadState.set({ progress: 0, status: 'uploading', fileName: file.name });

    // Simulate upload progress
    return timer(0, 100).pipe(
      map((i) => i * 2), // Increment by 2%
      takeWhile((progress) => progress <= 100),
      map((progress) => {
        if (progress < 100) {
          this.uploadState.update((s) => ({ ...s, progress }));
        } else {
          this.uploadState.update((s) => ({ ...s, progress: 100, status: 'processing' }));
          // Simulate processing delay
          setTimeout(() => {
            this.uploadState.update((s) => ({ ...s, status: 'completed' }));
          }, 2000);
        }
        return progress;
      }),
    );
  }

  reset() {
    this.uploadState.set({ progress: 0, status: 'idle' });
  }
}
