import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePreviewService {
  showImage(imageUrl: string) {
    const modalId = 'imagePreviewModal_' + Math.floor(Math.random() * 10000);

    // Create modal HTML
    const modalHtml = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content bg-transparent border-0 position-relative">

      <!-- Close button -->
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow"
        data-bs-dismiss="modal" aria-label="Close"></button>

      <!-- Image -->
      <img src="${imageUrl}" class="img-fluid rounded shadow-lg " />

    </div>
  </div>
</div>
    `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div);

    // Show modal
    const modalElement = document.getElementById(modalId);
    const bsModal = new (window as any).bootstrap.Modal(modalElement);
    bsModal.show();

    // Remove modal from DOM after it's hidden
    modalElement?.addEventListener('hidden.bs.modal', () => {
      modalElement.remove();
    });
  }
}
