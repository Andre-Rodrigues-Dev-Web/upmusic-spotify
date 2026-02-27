import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../core/services/upload.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faFilter, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    template: `
    <div class="catalog-container">
      <div class="header">
        <h1>Meu Catálogo</h1>
        <p>Gerencie todos os seus lançamentos e distribuições.</p>
      </div>

      <div class="filters-bar">
        <div class="search-box">
          <fa-icon [icon]="faSearch"></fa-icon>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar música ou artista..." />
        </div>
        <div class="filter-actions">
          <button class="filter-btn">
            <fa-icon [icon]="faFilter"></fa-icon>
            Filtrar
          </button>
        </div>
      </div>

      <div class="catalog-grid">
        <div *ngFor="let release of filteredReleases()" class="release-card">
          <div class="artwork-wrapper">
             <div class="artwork-placeholder">
               <span>🎵</span>
             </div>
             <div class="status-overlay">
               <span class="badge" [class]="release.status.toLowerCase()">{{ release.status }}</span>
             </div>
          </div>
          <div class="release-info">
            <div class="main-info">
              <h3>{{ release.title }}</h3>
              <p>{{ release.artist }}</p>
            </div>
            <div class="meta-info">
              <span>{{ release.genre }}</span>
              <span>•</span>
              <span>{{ release.streams | number }} streams</span>
            </div>
          </div>
          <button class="options-btn">
            <fa-icon [icon]="faEllipsisVertical"></fa-icon>
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .catalog-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
      p { color: #b3b3b3; }
    }

    .filters-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 1rem;

      .search-box {
        flex: 1;
        background: #282828;
        border-radius: 500px;
        padding: 0.8rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;

        fa-icon { color: #b3b3b3; }
        input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1rem;
        }
      }

      .filter-btn {
        background: #282828;
        border: none;
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 500px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transition: background 0.2s;

        &:hover { background: #3e3e3e; }
      }
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .release-card {
      background: #181818;
      padding: 1rem;
      border-radius: 8px;
      transition: background 0.3s;
      position: relative;
      cursor: pointer;

      &:hover {
        background: #282828;
        .options-btn { opacity: 1; }
      }

      .artwork-wrapper {
        position: relative;
        aspect-ratio: 1;
        margin-bottom: 1rem;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);

        .artwork-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #404040 0%, #282828 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          span { font-size: 3rem; opacity: 0.5; }
        }

        .status-overlay {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }
      }

      .release-info {
        .main-info {
          h3 { font-size: 1rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          p { color: #b3b3b3; font-size: 0.875rem; margin-bottom: 0.5rem; }
        }
        .meta-info {
          display: flex;
          gap: 0.5rem;
          color: #b3b3b3;
          font-size: 0.75rem;
        }
      }

      .options-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0,0,0,0.7);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
        cursor: pointer;
        z-index: 2;
      }
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 500px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;

      &.live { background: #1ed760; color: #000; }
      &.processing { background: #f59e0b; color: #000; }
      &.rejected { background: #ef4444; color: #fff; }
    }
  `]
})
export class CatalogComponent {
    private uploadService = inject(UploadService);

    faSearch = faSearch;
    faFilter = faFilter;
    faEllipsisVertical = faEllipsisVertical;

    searchTerm = '';
    releases = this.uploadService.releases;

    filteredReleases() {
        return this.releases().filter((r: any) =>
            r.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            r.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
}
