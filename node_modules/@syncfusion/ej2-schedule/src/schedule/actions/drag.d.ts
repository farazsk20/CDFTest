import { ActionBase } from '../actions/action-base';
/**
 * Schedule events drag actions
 */
export declare class DragAndDrop extends ActionBase {
    wireDragEvent(element: HTMLElement, isAllDay: boolean): void;
    private dragHelper;
    private dragPosition;
    private setDragActionDefaultValues;
    private dragStart;
    private drag;
    private dragStop;
    updateNavigatingPosition(e: MouseEvent & TouchEvent): void;
    updateDraggingDateTime(e: MouseEvent & TouchEvent): void;
    navigationWrapper(): void;
    private viewNavigation;
    private morePopupEventDragging;
    private calculateVerticalTime;
    private swapDragging;
    private calculateVerticalDate;
    private calculateTimelineTime;
    private calculateTimelineDate;
    private calculateResourceGroupingPosition;
    private appendCloneElement;
    private getEventWrapper;
    private getAllDayEventHeight;
    private isAllowDrop;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
}
