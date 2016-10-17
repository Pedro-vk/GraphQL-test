import { Observable } from 'rxjs';

export class AttributeCounter<T> {
  private attrs: string[] = [];
  private attributes: string[];
  private arrayAttributes: string[];

  // TODO add a special type for add custom counters (for example: nodes with services)
  // Add node status? (up/down)
  constructor (attributes: string[] = [], arrayAttributes: string[] = []) {
    this.attributes = attributes;
    this.arrayAttributes = arrayAttributes;
    this.attrs = [].concat(this.attributes).concat(this.arrayAttributes);
  }

  counterFrom(observable: Observable<T[]>): Observable<any> {
    return observable
      .map((list: T[]): any => {
        return list
          .reduce((acc: any, item: T) => {
            this.attributes
              .forEach((attr: string) => acc[attr][item[attr]] = (acc[attr][item[attr]] || 0) + 1);
            this.arrayAttributes
              .forEach((attr: string) => {
                item[attr]
                  .forEach((items: any) => {
                    acc[attr][items.name] = (acc[attr][items.name] || 0) + 1;
                  });
              });
            return acc;
          }, this.getNewCounterObject());
      });
  }

  private getNewCounterObject(): any {
    const counterObject = {};
    this.attrs.map((_: string) => counterObject[_] = {});
    return counterObject;
  }
}
