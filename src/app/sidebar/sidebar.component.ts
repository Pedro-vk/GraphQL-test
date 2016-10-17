import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';

@Component({
  selector: 'Sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./sidebar.html'),
  styles: [require('./sidebar.scss')]
})
export class SidebarComponent implements AfterViewInit {
  @Output() appliedFiltersChange = new EventEmitter<any>();
  appliedFilters: any = {};
  private _filters: any = {};

  constructor() { }

  ngAfterViewInit(): void {
    this.onChangeFilter();
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

  private setAppliedFilters(filters: any): void {
    if (!(filters instanceof Object)) {
      return;
    }
    Object.keys(filters)
      .forEach((filter: string) => {
        if (!this.appliedFilters[filter]) {
          this.appliedFilters[filter] = {};
        }
        Object.keys(filters[filter])
          .forEach((attr: string) => {
            if (typeof this.appliedFilters[filter][attr] !== 'boolean') {
              this.appliedFilters[filter][attr] = false;
            }
          });
      });
  }
}
