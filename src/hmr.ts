import { ApplicationRef, NgModuleRef } from '@angular/core';
import { createNewHosts, removeNgStyles, createInputTransfer, setInputValues } from '@angularclass/hmr';

import { ClusterService } from './app/shared/services';
import { ClusterNode } from './app/shared';

export let clusterState: ClusterNode[];

export function hotBootstrap(module: any, bootstrap: () => Promise<NgModuleRef<any>>) {
  let moduleRef: NgModuleRef<any>;

  bootstrap()
    .then(mod => moduleRef = mod)

  module.hot.accept();

  module.hot.dispose(() => {

    const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
    const clusterService: ClusterService = moduleRef.injector.get(ClusterService);

    clusterState = clusterService.getClusterNodeLastValue()
    clusterService.destroy();

    const restoreInputValues = createInputTransfer();

    setTimeout(() => restoreInputValues(), 3000);

    const cmpLocations = appRef.components.map(cmp => cmp.location.nativeElement);
    const disposeOldHosts = createNewHosts(cmpLocations);

    moduleRef.destroy();

    removeNgStyles();
    disposeOldHosts();
  });

}
