import { Observable } from 'rxjs';

export class AttributeCounter<T> {
  private attributes: string[];
  private arrayAttributes: string[];
  private counterObject: any = {};

  // TODO add a special type for add custom counters (for example: nodes with services)
  // Add node status? (up/down)
  constructor (attributes: string[] = [], arrayAttributes: string[] = []) {
    this.attributes = attributes;
    this.arrayAttributes = arrayAttributes;

    let attrs = [].concat(attributes).concat(arrayAttributes);
    attrs.forEach((_: string) => this.counterObject[_] = {});
    Object.freeze(this.counterObject);
  }

  counterFrom(observable: Observable<T[]>): Observable<any> {
    let counterObjectCopy = Object.assign({}, this.counterObject);

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
          }, counterObjectCopy);
      });
  }
}
