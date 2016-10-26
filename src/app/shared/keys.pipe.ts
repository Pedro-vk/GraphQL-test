import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'pgpKeys'})
export class KeysPipe implements PipeTransform {
  transform(value: any): any[] {
    if (!value) {
      return [];
    }
    return Object.keys(value)
      .map((_: string) => ({key: _, value: value[_]}));
  }
}
