import { Injectable, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable()
export class DragAndDropService {
  private supportsPassive: boolean = false;
  private enablePassive: any = {passive: true};

  constructor(@Inject(DOCUMENT) private document: any) {
    this.testSupportedPassiveEvents();
  }

  getScrollSubscription(elementRef: ElementRef): Observable<any> {
    let scrollTarget = elementRef.nativeElement;

    return Observable.fromEvent(scrollTarget, 'mousewheel', this.enablePassive)
      .map((event: any) => ({
        x: event.deltaX,
        y: event.deltaY,
      }));
  }

  getDragAndDropSubscription(elementRef: ElementRef): Observable<any> {
    let dragTarget = elementRef.nativeElement;

    let mousedown = Observable.merge(
      Observable.fromEvent(dragTarget, 'mousedown'),
      Observable.fromEvent(dragTarget, 'touchstart').map(this.touchToMousePosition),
    );
    let mousemove = Observable.merge(
      Observable.fromEvent(this.document, 'mousemove', this.enablePassive),
      Observable.fromEvent(this.document, 'touchmove', this.enablePassive).map(this.touchToMousePosition),
    );
    let mouseup = Observable.merge(
      Observable.fromEvent(this.document, 'mouseup'),
      Observable.fromEvent(this.document, 'touchend').map(this.touchToMousePosition),
    );

    return mousedown
      .flatMap((md: any): Observable<any> => {
        let lastY: number = md.clientY;
        let lastX: number = md.clientX;

        return mousemove
          .map((mm: any): number => {
            if (!this.supportsPassive) {
              mm.preventDefault();
            }
            let value: any = {
              y: mm.clientY - lastY,
              x: mm.clientX - lastX,
            };
            lastY = mm.clientY;
            lastX = mm.clientX;
            return value;
          })
          .takeUntil(mouseup);
      });

  }

  private touchToMousePosition(touchEvent: any): any {
    if (touchEvent.touches[0]) {
      touchEvent.clientX = touchEvent.touches[0].clientX;
      touchEvent.clientY = touchEvent.touches[0].clientY;
    }
    return touchEvent;
  }

  private testSupportedPassiveEvents(): void {
    try {
      let options = Object.defineProperty({}, 'passive', {
        get: (): void => {
          this.supportsPassive = true;
        },
      });
      this.document.addEventListener('test', undefined, options);
    } catch (e) {}

    if (!this.supportsPassive) {
      this.enablePassive = undefined;
    }
  }
}
