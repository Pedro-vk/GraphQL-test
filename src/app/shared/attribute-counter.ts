import { Observable } from 'rxjs';

export class AttributeCounter<T> {
  private attrs: string[] = [];
  private attributes: string[];
  private arrayAttributes: any;

  constructor (attributes: string[] = [], arrayAttributes: any = {}) {
    this.attributes = attributes;
    this.arrayAttributes = arrayAttributes;
    this.attrs = [].concat(this.attributes).concat(Object.keys(this.arrayAttributes));
  }

  counterFrom(observable: Observable<T[]>): Observable<any> {
    return observable
      .map((list: T[]): any => {
        return list
          .reduce((acc: any, item: T) => {
            this.attributes
              .forEach((attr: string) => acc[attr][item[attr]] = (acc[attr][item[attr]] || 0) + 1);
            Object.keys(this.arrayAttributes)
              .forEach((attr: string) => {
                item[attr]
                  .forEach((elem: any) => {
                    let id = this.arrayAttributes[attr](elem);
                    acc[attr][id] = (acc[attr][id] || 0) + 1;
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
