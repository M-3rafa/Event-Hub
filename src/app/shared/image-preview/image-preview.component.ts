import { Component, Input } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-image-preview',
  imports: [],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  @Input() imageUrl: string = '';
  modalId = 'imageModal' + Math.floor(Math.random() * 10000); // Unique ID

  openModal() {
    const modal = new bootstrap.Modal(document.getElementById(this.modalId)!);
    modal.show();
  }
}
