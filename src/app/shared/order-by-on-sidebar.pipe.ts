import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderByOnSidebar'})
export class OrderByOnSidebarPipe implements PipeTransform {
  transform(value: any[], filter: string) {
    if (!value) {
      return [];
    }
    return value
      .sort((a, b) => checkAttr(b) < checkAttr(a) ? 1 : -1);

    function checkAttr(_: any): string | number {
      return isNaN(+_[filter]) ? replaceSize(_[filter]) : +_[filter];
    }
    function replaceSize(key: string): string {
      if (key.indexOf('size') === -1) {
        return key;
      }
      return key
        .replace('size', '_size')
        .replace('-s', '-2')
        .replace('-m', '-3')
        .replace('-l', '-4');
    }
  }
}
