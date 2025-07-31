import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-space-background',
  standalone: true,
  template: `<div class="stars-container"></div>`,
  styleUrls: ['./space-background.component.scss'],
})
export class SpaceBackgroundComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const container = this.renderer.selectRootElement('.stars-container');

    const fixedStarsCount = 100;
    const movingStarsCount = 50;

    for (let i = 0; i < fixedStarsCount; i++) {
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');
      this.renderer.addClass(star, 'twinkle');
      star.style.left = `${Math.random() * window.innerWidth}px`;
      star.style.top = `${Math.random() * window.innerHeight}px`;
      this.renderer.appendChild(container, star);
    }

    for (let i = 0; i < movingStarsCount; i++) {
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');
      this.renderer.addClass(star, 'move');
      star.style.left = `${Math.random() * window.innerWidth}px`;
      star.style.top = `${Math.random() * window.innerHeight}px`;
      this.renderer.appendChild(container, star);
    }
  }
}
