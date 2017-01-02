import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

import { ClusterNode, Status, StatusStatus, DragAndDropService } from '../../shared';

export interface Cluster {
  location: string;
  clusternodes: ClusterNode[];
}

@Component({
  selector: 'pgp-cluster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./cluster.html'),
  styles: [require('./cluster.scss')],
})
export class ClusterComponent implements OnInit {
  clusterChanges: number = 0;
  onClusterChange: Subject<any> = new Subject();
  transformStyle: Observable<SafeStyle>;
  @Input() clusters: Cluster[];
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();
  @ViewChild('container') container: ElementRef;

  @Input()
  set nodes(nodes: ClusterNode[]) {
    this.clusters = this.transformNodesToClusters(nodes);
    setTimeout(() => this.onClusterChange.next(++this.clusterChanges));
  }

  constructor(
    private elementRef: ElementRef,
    private dragAndDropService: DragAndDropService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.initDragAndDrop();
  }

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  trackCluster(index: number, cluster: Cluster): any {
    return cluster.location || undefined;
  }

  trackNode(index: number, node: ClusterNode): any {
    return node.id || undefined;
  }

  private transformNodesToClusters(nodes: ClusterNode[]): Cluster[] {
    if (!nodes || nodes.length === 0) {
      return [];
    }

    let locations = nodes
      .reduce((acc: any, node: ClusterNode) => {
        if (!acc[node.location]) {
          acc[node.location] = [];
        }
        acc[node.location].push(node);
        return acc;
      }, {});

    return Object.keys(locations)
      .map((location: string) => <Cluster>{
        location: location,
        clusternodes: locations[location],
      })
      .sort((a: Cluster, b: Cluster) => a.location > b.location ? -1 : 1);
  }

  private initDragAndDrop(): void {
    let lastClusterChange: number = 0;
    let translateValue: number = 0;

    this.transformStyle = this.dragAndDropService.getDragAndDropSubscription(this.elementRef)
      .map((_: any) => _.y)
      .combineLatest<number, any, SafeStyle>(
        this.onClusterChange,
        (drag: number, changes: number) => {
          let value: number = 0;
          if (changes === lastClusterChange) {
            value = drag;
          }
          lastClusterChange = changes;
          return value;
        },
      )
      .map((drag: number): SafeStyle => {
        let visibleHeight = this.elementRef.nativeElement.offsetHeight * 1;
        let clusterHeight = this.container.nativeElement.offsetHeight;
        let availableTranslate = clusterHeight - visibleHeight;

        translateValue += drag * 2.5;
        if (translateValue > availableTranslate) {
          translateValue = availableTranslate;
        }
        if (translateValue < 0) {
          translateValue = 0;
        }
        return this.getTransform(translateValue);
      });
  }

  private getTransform(translateX: number): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(-50%) perspective(600px) rotateX(30deg) translateY(${translateX}px)`,
    );
  }
}
