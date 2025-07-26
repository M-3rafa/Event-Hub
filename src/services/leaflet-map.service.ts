import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {
  private renderedMaps = new Set<number>();

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  async renderMap(eventId: number, lat: number, lng: number): Promise<void> {
    if (!this.isBrowser()) return;

    const mapId = `adminEventMap-${eventId}`;
    const container = document.getElementById(mapId);
    if (!container || this.renderedMaps.has(eventId)) return;

    const L = await import('leaflet');

    container.innerHTML = '';

    const map = L.map(mapId).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);

    this.renderedMaps.add(eventId);
  }

  clearRenderedMap(eventId: number) {
    this.renderedMaps.delete(eventId);
  }

  resetAllMaps() {
    this.renderedMaps.clear();
  }
}
