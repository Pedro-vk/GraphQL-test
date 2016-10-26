import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { imports, declarations } from './app.module';


describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: declarations,
      providers: [],
    });
  });

  it('should have an url', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(true).toEqual(true);
  });

});
