import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  private uploadService = inject(UploadService);
  private fb = inject(FormBuilder);

  uploadState = this.uploadService.uploadState;

  uploadForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    artist: ['', Validators.required],
    genre: ['', Validators.required],
    releaseDate: ['', Validators.required],
  });

  isDragging = false;
  selectedFile: File | null = null;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  handleFileSelection(file: File) {
    if (file.type.startsWith('audio/')) {
      this.selectedFile = file;
      // Auto-fill title from filename if empty
      if (!this.uploadForm.get('title')?.value) {
        this.uploadForm.patchValue({
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        });
      }
    } else {
      alert('Please select a valid audio file.');
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploadService.simulateUpload(this.selectedFile).subscribe();
    }
  }

  resetUpload() {
    this.selectedFile = null;
    this.uploadForm.reset();
    this.uploadService.reset();
  }
}
