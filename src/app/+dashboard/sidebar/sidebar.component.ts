import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';

@Component({
  selector: 'pgp-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./sidebar.html'),
  styles: [require('./sidebar.scss')],
})
export class SidebarComponent implements AfterViewInit {
  @Input() filterClassFn: () => string;
  @Input() dictionary: any = {};
  @Input() filterName: any = {};
  @Input() orderBy: string;
  @Input() orderByList: string[] = [];
  @Output() appliedFiltersChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() orderByChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchChange: EventEmitter<any> = new EventEmitter<any>();
  appliedFilters: any = {};
  private _filters: any[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.onChangeFilter();
    this.orderByChange.emit(this.orderBy);
    this.searchChange.emit('');
  }

  @Input()
  set filters(filters: any) {
    this._filters = filters;
    this.setAppliedFilters(filters);
  }
  get filters(): any {
    return this._filters;
  }

  onChangeFilter(): void {
    this.appliedFiltersChange.emit(this.appliedFilters);
  }

  private setAppliedFilters(filters: any[]): void {
    if (!filters || filters.length === 0) {
      return;
    }
    filters
      .forEach((filter: any) => {
        if (!this.appliedFilters[filter.key]) {
          this.appliedFilters[filter.key] = {};
        }
        Object.keys(filter.value)
          .forEach((attr: string) => {
            if (typeof this.appliedFilters[filter.key][attr] !== 'boolean') {
              this.appliedFilters[filter.key][attr] = false;
            }
          });
      });
  }
}
