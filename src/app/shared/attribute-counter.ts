import { Observable } from 'rxjs';
import { parseFilterName } from './parse-filter-name';

export class AttributeCounter<T> {
  private attrs: string[] = [];

  constructor (private attributes: string[] = [], private arrayAttributes: any = {}, private defaultValues: any = {}) {
    this.attrs = []
      .concat(this.attributes)
      .concat(Object.keys(this.arrayAttributes));
  }

  counterFrom(observable: Observable<T[]>): Observable<any> {
    return observable
      .map((list: T[]): any => {
        let counter = list
          .reduce((acc: any, item: T) => {
            this.attributes
              .forEach((attr: string) => acc[attr][item[attr]] = (acc[attr][item[attr]] || 0) + 1);
            Object.keys(this.arrayAttributes)
              .forEach((attrName: string) => {
                let name: string = parseFilterName(attrName).name;
                let attr: string = parseFilterName(attrName).attr;
                item[attr]
                  .forEach((elem: any) => {
                    let id = this.arrayAttributes[attrName](elem);
                    acc[name][id] = (acc[name][id] || 0) + 1;
                  });
              });
            return acc;
          }, this.getNewCounterObject());
        Object.keys(this.defaultValues)
          .forEach(key => {
            this.defaultValues[key]
              .forEach((filter: string) => {
                counter[key][filter] = counter[key][filter] || 0;
              });
          });
        return counter;
      });
  }

  private getNewCounterObject(): any {
    const counterObject = {};
    this.attrs.map((_: string) => counterObject[parseFilterName(_).name] = {});
    return counterObject;
  }
}
