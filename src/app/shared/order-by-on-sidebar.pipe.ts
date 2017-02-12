import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'pgpOrderByOnSidebar'})
export class OrderByOnSidebarPipe implements PipeTransform {
  transform(value: any[], filter: string): any[] {
    if (!value) {
      return [];
    }
    return [...value]
      .sort((a, b) => checkAttr(b) < checkAttr(a) ? 1 : -1);

    function checkAttr(_: any): string | number {
      return isNaN(+_[filter]) ? replaceOrder(_[filter]) : +_[filter];
    }
    function replaceOrder(key: string): string {
      if (key.indexOf('size') === -1 && ['started', 'waiting', 'stopped'].indexOf(key) === -1) {
        return key;
      }
      return key
        .replace('size', '_size')
        .replace('-s', '-2')
        .replace('-m', '-3')
        .replace('-l', '-4')
        .replace('started', '1')
        .replace('waiting', '2')
        .replace('stopped', '3');
    }
  }
}
