import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-space-background',
  imports: [],
  templateUrl: './space-background.component.html',
  styleUrl: './space-background.component.scss',
})
export class SpaceBackgroundComponent implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.createStars();
  }

  createStars(): void {
    const starsContainer = this.el.nativeElement.querySelector('.stars');
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = Math.random() * 2 + 1;

      this.renderer.setStyle(star, 'left', `${x}px`);
      this.renderer.setStyle(star, 'top', `${y}px`);
      this.renderer.setStyle(star, 'width', `${size}px`);
      this.renderer.setStyle(star, 'height', `${size}px`);

      this.renderer.appendChild(starsContainer, star);
    }
  }
}
