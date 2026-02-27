import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface Release {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string;
  status: 'Live' | 'Processing' | 'Rejected';
  streams: number;
  fileName: string;
}

export interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  fileName?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'upmusic_releases';

  // Signals for state
  uploadState = signal<UploadState>({ progress: 0, status: 'idle' });
  releases = signal<Release[]>(this.loadReleases());

  private readonly API_URL = 'https://api.upmusic.com/v1/distribute';

  private loadReleases(): Release[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Summer Vibes', artist: 'DJ Cool', genre: 'Pop', releaseDate: '2023-12-01', status: 'Live', streams: 12500, fileName: 'summer.mp3' },
      { id: '2', title: 'Midnight Rain', artist: 'LoFi Girl', genre: 'Lo-Fi', releaseDate: '2024-01-15', status: 'Processing', streams: 0, fileName: 'midnight.mp3' },
      { id: '3', title: 'Urban Jungle', artist: 'The City', genre: 'Hip-Hop', releaseDate: '2023-11-20', status: 'Rejected', streams: 0, fileName: 'urban_j.mp3' },
    ];
  }

  private saveRelease(metadata: any) {
    const newRelease: Release = {
      id: Date.now().toString(),
      title: metadata.title,
      artist: metadata.artist,
      genre: metadata.genre,
      releaseDate: metadata.releaseDate,
      status: 'Live', // In a real app, it would start as 'Processing'
      streams: 0,
      fileName: this.uploadState().fileName || 'unknown',
    };

    const updated = [newRelease, ...this.releases()];
    this.releases.set(updated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  distribute(file: File, metadata: any): Observable<any> {
    const formData = new FormData();
    formData.append('audio', file);
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));

    this.uploadState.set({ progress: 0, status: 'uploading', fileName: file.name });

    return this.http.post(this.API_URL, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * (event.loaded || 0)) / (event.total || 1));
          this.uploadState.update((s: UploadState) => ({ ...s, progress }));
        } else if (event.type === HttpEventType.Response) {
          this.uploadState.update((s: UploadState) => ({ ...s, status: 'processing', progress: 100 }));

          // Save to LocalStorage once upload is done
          this.saveRelease(metadata);

          setTimeout(() => {
            this.uploadState.update((s: UploadState) => ({ ...s, status: 'completed' }));
          }, 1500);
        }
      }),
      catchError((error: any) => {
        this.uploadState.update((s: UploadState) => ({
          ...s,
          status: 'error',
          error: 'Falha ao distribuir música para o Spotify.'
        }));
        return of(null);
      })
    );
  }

  reset() {
    this.uploadState.set({ progress: 0, status: 'idle' });
  }
}
