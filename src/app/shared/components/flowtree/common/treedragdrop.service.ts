import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TreeNodeDragEvent } from './api';

@Injectable()
export class TreeDragDropService {

    private dragStartSource = new Subject<TreeNodeDragEvent>();
    private dragStopSource = new Subject<TreeNodeDragEvent>();

    dragStart$ = this.dragStartSource.asObservable();
    dragStop$ = this.dragStopSource.asObservable();

    startDrag(event: TreeNodeDragEvent) {
        this.dragStartSource.next(event);
    }

    stopDrag(event: TreeNodeDragEvent) {
        this.dragStopSource.next(event);
    }
}
