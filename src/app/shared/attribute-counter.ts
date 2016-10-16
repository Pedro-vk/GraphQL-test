import { Observable } from 'rxjs';

export class AttributeCounter<T> {
  private attributes: String[];
  private arrayAttributes: String[];
  private counterObject: any = {};

  constructor (attributes: String[] = [], arrayAttributes: String[] = []) {
    this.attributes = attributes;
    this.arrayAttributes = arrayAttributes;
  }

  counterFrom(observable: Observable<T[]>): Observable<any> {
    return observable
      .map((list: T[]): any => {
        return list
          .reduce((acc: any, item: T) => {
            this.attributes
              .forEach((attr: String) => acc[attr.toString()][item[attr.toString()]] = (acc[attr.toString()][item[attr.toString()]] || 0) + 1);
            this.arrayAttributes
              .forEach((attr: String) => {
                item[attr.toString()]
                  .forEach((items: any) => {
                    acc[attr.toString()][items.name] = (acc[attr.toString()][items.name] || 0) + 1;
                  });
              });
            return acc;
          }, {
            cores: {},
            memory: {},
            tags: {},
          });
      })
  }
}
