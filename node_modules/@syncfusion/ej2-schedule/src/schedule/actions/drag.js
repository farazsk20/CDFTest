var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createElement, closest, Draggable, extend, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, remove, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { ActionBase } from '../actions/action-base';
import * as events from '../base/constant';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
/**
 * Schedule events drag actions
 */
var DragAndDrop = /** @class */ (function (_super) {
    __extends(DragAndDrop, _super);
    function DragAndDrop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragAndDrop.prototype.wireDragEvent = function (element, isAllDay) {
        var dragAreaTarget = cls.CURRENT_PANEL_CLASS;
        new Draggable(element, {
            abort: '.' + cls.EVENT_RESIZE_CLASS,
            clone: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: (this.parent.eventDragArea) ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.eventDragArea) ?
                document.querySelector(this.parent.eventDragArea) :
                this.parent.element.querySelector('.' + dragAreaTarget),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element;
        this.actionObj.action = 'drag';
        this.actionObj.clone = this.createCloneElement(this.actionObj.element);
        if (!this.parent.eventDragArea && this.parent.currentView !== 'Month' &&
            this.parent.timeScale.enable && !this.parent.activeView.isTimelineView() &&
            !this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
        }
        this.actionObj.clone.style.top = formatUnit(this.actionObj.element.offsetTop);
        this.actionObj.cloneElement = [this.actionObj.clone];
        this.actionObj.originalElement = [this.actionObj.element];
        return this.actionObj.clone;
    };
    DragAndDrop.prototype.dragPosition = function (e) {
        if (this.parent.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        var slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        var cellWidth = this.parent.activeView.isTimelineView() ? (this.actionObj.cellWidth / slotInterval) *
            this.actionObj.interval : this.actionObj.cellWidth;
        var cellHeight = (this.actionObj.cellHeight / slotInterval) * this.actionObj.interval;
        var leftOffset = this.parent.enableRtl ? parseInt(e.left, 10) : Math.abs(parseInt(e.left, 10));
        var leftValue = formatUnit(0);
        if (this.parent.currentView === 'Month') {
            leftValue = e.left;
        }
        if (this.parent.activeView.isTimelineView()) {
            leftValue = formatUnit(Math.floor(leftOffset / cellWidth) * cellWidth);
        }
        var topValue;
        if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable ||
            (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)))) {
            topValue = formatUnit(this.actionObj.clone.offsetTop);
        }
        else if (this.parent.currentView === 'Month') {
            topValue = formatUnit(0);
        }
        else if (this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit(this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).offsetTop);
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth)
            });
        }
        else {
            if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
                !this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                setStyleAttribute(this.actionObj.clone, {
                    height: formatUnit(this.actionObj.cellHeight),
                    width: formatUnit(this.actionObj.cellWidth),
                    pointerEvents: 'none'
                });
            }
            topValue = formatUnit(Math.ceil(parseInt(e.top, 10) / cellHeight) * cellHeight);
            var scrollHeight = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            var cloneBottom = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
        }
        return { left: leftValue, top: topValue };
    };
    DragAndDrop.prototype.setDragActionDefaultValues = function () {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        var workCell = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var eventGuid = this.actionObj.element.getAttribute('data-guid');
        this.actionObj.event = this.parent.eventBase.getEventByGuid(eventGuid);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var dragArgs = {
            cancel: false,
            data: eventObj,
            event: e,
            excludeSelectors: null,
            element: this.actionObj.element,
            interval: this.actionObj.interval,
            navigation: { enable: false, timeDelay: 2000 },
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(events.dragStart, dragArgs);
        if (dragArgs.cancel) {
            this.removeCloneElement();
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.actionObj.start = eventObj[this.parent.eventFields.startTime];
        this.actionObj.end = eventObj[this.parent.eventFields.endTime];
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = dragArgs.interval;
        this.actionObj.navigation = dragArgs.navigation;
        this.actionObj.scroll = dragArgs.scroll;
        this.actionObj.excludeSelectors = dragArgs.excludeSelectors;
    };
    DragAndDrop.prototype.drag = function (e) {
        this.parent.quickPopup.quickPopupHide(true);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventArgs = this.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
        if (this.parent.eventDragArea) {
            var targetElement = eventArgs.target;
            this.actionObj.clone.style.top = formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = formatUnit(targetElement.offsetLeft);
            var currentTarget = closest(targetElement, '.' + cls.ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            }
            else {
                if (!(this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek'
                    || this.parent.currentView === 'Day')) {
                    this.actionObj.clone.style.height = formatUnit(this.actionObj.element.offsetHeight);
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        var dragArgs = { data: eventObj, event: e, element: this.actionObj.element };
        this.parent.trigger(events.drag, dragArgs);
    };
    DragAndDrop.prototype.dragStop = function (e) {
        this.removeCloneElement();
        clearInterval(this.actionObj.navigationInterval);
        this.actionObj.navigationInterval = null;
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        this.actionObj.action = null;
        if (this.isAllowDrop(e)) {
            return;
        }
        var dragArgs = { cancel: false, data: this.getChangedData(), event: e, element: this.actionObj.element };
        this.parent.trigger(events.dragStop, dragArgs);
        if (dragArgs.cancel) {
            return;
        }
        this.saveChangedData(dragArgs);
    };
    DragAndDrop.prototype.updateNavigatingPosition = function (e) {
        var _this = this;
        if (this.actionObj.navigation.enable) {
            var currentDate_1 = new Date();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(function () {
                    if (currentDate_1) {
                        var crtDate = new Date();
                        var end = crtDate.getSeconds();
                        var start = currentDate_1.getSeconds() + (_this.actionObj.navigation.timeDelay / 1000);
                        start = (start >= 60) ? start - 60 : start;
                        if (start === end) {
                            currentDate_1 = new Date();
                            _this.viewNavigation(e);
                            _this.updateDraggingDateTime(e);
                        }
                    }
                }, this.actionObj.navigation.timeDelay);
            }
        }
    };
    DragAndDrop.prototype.updateDraggingDateTime = function (e) {
        if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
            this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        }
        else if (this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'TimelineMonth') {
                this.calculateTimelineDate(e);
            }
            else {
                this.calculateTimelineTime(e);
            }
        }
        else {
            if (this.parent.currentView === 'Month') {
                this.calculateVerticalDate(e);
            }
            else {
                this.calculateVerticalTime(e);
            }
        }
    };
    DragAndDrop.prototype.navigationWrapper = function () {
        if (!this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'Month' || !this.parent.timeScale.enable) {
                var outerWrapperCls = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                var targetWrapper = outerWrapperCls.item(this.actionObj.index).querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls.item(this.actionObj.index).appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            }
            else {
                var wrapperClass = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    var elementHeight_1 = this.getAllDayEventHeight();
                    var event_1 = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event_1[0].offsetHeight < elementHeight_1) {
                        event_1.forEach(function (element) { return element.style.height = ((elementHeight_1 + 2) / 12) + 'em'; });
                    }
                    this.actionObj.clone.style.height = formatUnit(elementHeight_1);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 0);
            }
        }
        else {
            var outWrapper = void 0;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            }
            else {
                outWrapper = this.parent.element.querySelector('.' + cls.APPOINTMENT_CONTAINER_CLASS);
            }
            var tarWrapper = outWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
            if (!tarWrapper) {
                tarWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                outWrapper.appendChild(tarWrapper);
            }
            tarWrapper.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.viewNavigation = function (e) {
        var navigationType;
        var dragArea = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'next' : 'previous';
            }
            else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'previous' : 'next';
            }
            if (navigationType) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate(navigationType));
            }
        }
    };
    DragAndDrop.prototype.morePopupEventDragging = function (e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'td')))) {
            return;
        }
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var td = closest(e.target, 'td');
        var dragStart = new Date(parseInt(td.getAttribute('data-date'), 10));
        var dragEnd = new Date(dragStart.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = formatUnit(td.offsetParent.offsetTop);
        this.actionObj.clone.style.left = formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = formatUnit(td.offsetWidth);
        var eventContainer = td;
        var eventWrapper;
        if (this.parent.activeView.isTimelineView()) {
            var rowIndex = closest(td, 'tr').rowIndex;
            eventContainer = this.parent.element.querySelectorAll('.e-appointment-container').item(rowIndex);
        }
        eventWrapper = eventContainer.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
    };
    DragAndDrop.prototype.calculateVerticalTime = function (e) {
        if (isNullOrUndefined(this.actionObj.target) ||
            (this.actionObj.target && isNullOrUndefined(closest(this.actionObj.target, 'tr'))) ||
            (!(closest(this.actionObj.target, 'td').classList.contains(cls.WORK_CELLS_CLASS)) &&
                !(closest(this.actionObj.target, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        var dragArea = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventStart = eventObj[this.parent.eventFields.startTime];
        var eventEnd = eventObj[this.parent.eventFields.endTime];
        var eventDuration = eventEnd.getTime() - eventStart.getTime();
        var offsetTop = Math.floor(parseInt(this.actionObj.clone.style.top, 0) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop :
                dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight;
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = formatUnit(offsetTop);
        }
        var rowIndex = offsetTop / this.actionObj.cellHeight;
        var heightPerMinute = this.actionObj.cellHeight / this.actionObj.slotInterval;
        var diffInMinutes = parseInt(this.actionObj.clone.style.top, 0) - offsetTop;
        var isAllDayDrag = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
        var tr;
        if (isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS);
        }
        else {
            var trCollections = this.parent.getContentTable().querySelectorAll('tr');
            tr = trCollections.item(rowIndex);
        }
        var index;
        if (closest(this.actionObj.target, 'td').classList.contains(cls.WORK_CELLS_CLASS) ||
            closest(this.actionObj.target, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            index = closest(this.actionObj.target, 'td').cellIndex;
        }
        var colIndex = isNullOrUndefined(index) ? closest(this.actionObj.clone, 'td').cellIndex : index;
        this.actionObj.index = colIndex;
        var td = tr.childNodes.item(colIndex);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        var dragStart;
        var dragEnd;
        if (this.parent.activeViewOptions.timeScale.enable && !isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            var spanHours = -(((this.actionObj.slotInterval / this.actionObj.cellHeight) * diffInMinutes) * (1000 * 60));
            if (this.actionObj.clone.querySelector('.' + cls.EVENT_ICON_UP_CLASS)) {
                var startTime = new Date(eventStart.getTime());
                spanHours = util.addDays(util.resetTime(new Date(startTime.getTime())), 1).getTime() - startTime.getTime();
            }
            dragStart = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart.setMinutes(dragStart.getMinutes() + (diffInMinutes * heightPerMinute));
            dragStart.setMilliseconds(-spanHours);
            dragStart = this.calculateIntervalTime(dragStart);
            dragStart.setMilliseconds(spanHours);
            dragEnd = new Date(dragStart.getTime());
            if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            }
            else {
                dragEnd.setMilliseconds(eventDuration);
            }
        }
        else {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            dragStart = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = util.addDays(util.resetTime(dragEnd), 1);
            }
        }
        this.actionObj.start = new Date(+dragStart);
        this.actionObj.end = new Date(+dragEnd);
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.swapDragging = function (e) {
        var colIndex = closest(this.actionObj.target, 'td').cellIndex;
        if (closest(this.actionObj.target, '.' + cls.DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            var eventHeight_1 = this.getAllDayEventHeight();
            var allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight_1) {
                allDayElement.forEach(function (element) { return element.style.height = ((eventHeight_1 + 2) / 12) + 'em'; });
            }
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(this.actionObj.cellWidth),
                height: formatUnit(eventHeight_1),
                top: formatUnit(this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).offsetTop)
            });
        }
        if (closest(this.actionObj.target, '.' + cls.WORK_CELLS_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.DAY_WRAPPER_CLASS)) {
            removeClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            var height = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            setStyleAttribute(this.actionObj.clone, {
                left: formatUnit(0),
                height: formatUnit(height),
                width: formatUnit(this.actionObj.cellWidth)
            });
        }
    };
    DragAndDrop.prototype.calculateVerticalDate = function (e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'tr')))) {
            return;
        }
        this.actionObj.clone.style.top = formatUnit(0);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var td = closest(this.actionObj.target, 'td');
        var tr = td.parentElement;
        var colIndex = (tr.rowIndex * tr.childNodes.length) + td.cellIndex;
        this.actionObj.index = colIndex;
        // let cellIndex: number = td.cellIndex;
        // let daysCount: number = Math.floor(this.actionObj.element.offsetWidth / this.actionObj.cellWidth);
        // let maxIndex: number = (tr.lastChild as HTMLTableCellElement).cellIndex;
        // if (cellIndex + daysCount > maxIndex) {
        //     this.actionObj.clone.style.width = formatUnit((this.actionObj.cellWidth - 2) * ((maxIndex + 1) - cellIndex));
        // } else {
        //     this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
        // }
        var outerWrapper = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        var targetWrapper = outerWrapper.item(colIndex).querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (!targetWrapper) {
            targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            outerWrapper.item(colIndex).appendChild(targetWrapper);
        }
        if (!targetWrapper.querySelector('.' + cls.CLONE_ELEMENT_CLASS)) {
            this.appendCloneElement(targetWrapper);
        }
        var timeString = outerWrapper.item(colIndex).getAttribute('data-date') ||
            eventObj[this.parent.eventFields.startTime].getTime().toString();
        var dragStart = new Date(parseInt(timeString, 10));
        var dragEnd = new Date(dragStart.getTime());
        if (this.parent.enableRtl) {
            var endTimeDiff = eventObj[this.parent.eventFields.endTime].getTime() -
                (util.resetTime(new Date(+eventObj[this.parent.eventFields.endTime]))).getTime();
            dragEnd = new Date(dragStart.getTime() + endTimeDiff);
            dragStart = new Date(dragEnd.getTime() - eventDuration);
        }
        else {
            var startTimeDiff = eventObj[this.parent.eventFields.startTime].getTime() -
                (util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
            dragStart = new Date(dragStart.getTime() + startTimeDiff);
            dragEnd = new Date(dragStart.getTime() + eventDuration);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateTimelineTime = function (e) {
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        var offsetLeft = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        var rightOffset;
        var diffInMinutes = this.actionObj.clone.offsetLeft - offsetLeft;
        var viewEle = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            this.actionObj.clone.style.right = formatUnit(rightOffset);
            diffInMinutes = rightOffset - offsetLeft;
        }
        if (this.scrollEdges.left || this.scrollEdges.right) {
            if (this.parent.enableRtl) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
                this.actionObj.clone.style.left = formatUnit(rightOffset);
            }
            else {
                offsetLeft = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
                this.actionObj.clone.style.left = formatUnit(offsetLeft);
            }
        }
        var widthPerMinute = this.actionObj.slotInterval / this.actionObj.cellWidth;
        var colIndex = this.getIndex(Math.floor(offsetLeft / this.actionObj.cellWidth));
        var tr = this.parent.getContentTable().querySelector('tr');
        var eventStart = new Date(parseInt(tr.childNodes.item(colIndex).getAttribute('data-date'), 10));
        eventStart.setMinutes(eventStart.getMinutes() + Math.round((widthPerMinute * diffInMinutes)));
        eventStart = this.calculateIntervalTime(eventStart);
        if (!this.parent.activeViewOptions.timeScale.enable) {
            var eventSrt = eventObj[this.parent.eventFields.startTime];
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        var eventEnd = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateTimelineDate = function (e) {
        var cloneIndex = 0;
        var rightOffset;
        var leftOffset;
        var viewEle = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var eventObj = extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        if (this.parent.enableRtl) {
            cloneIndex = (Math.floor(parseInt(this.actionObj.clone.style.right, 10))) / this.actionObj.cellWidth;
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            if (this.scrollEdges.left || this.scrollEdges.right) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft - this.actionObj.clone.offsetWidth;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
            }
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        }
        else {
            cloneIndex = Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth);
            leftOffset = parseInt(this.actionObj.clone.style.left, 10);
            if (this.scrollEdges.left || this.scrollEdges.right) {
                leftOffset = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
            }
            this.actionObj.clone.style.left = formatUnit(leftOffset);
        }
        cloneIndex = this.getIndex(cloneIndex);
        var tr = this.parent.getContentTable().querySelector('tr');
        var dragDate = new Date(parseInt(tr.childNodes.item(cloneIndex).getAttribute('data-date'), 10));
        var dragStart = new Date(dragDate.getTime());
        var srtDateDiff = eventObj[this.parent.eventFields.startTime].getTime() -
            (util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
        dragStart = new Date(dragStart.getTime() + srtDateDiff);
        var dragEnd = new Date(dragStart.getTime() + eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.calculateResourceGroupingPosition = function (e) {
        var dragArea = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var trCollection = this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)');
        var translateY = util.getTranslateY(dragArea.querySelector('table'));
        translateY = (isNullOrUndefined(translateY)) ? 0 : translateY;
        var rowIndex = Math.floor(Math.floor((this.actionObj.Y + (dragArea.scrollTop - translateY)) -
            dragArea.getBoundingClientRect().top) / this.actionObj.cellHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        var eventContainer = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        var eventWrapper = eventContainer.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
        var td = closest(e.target, 'td');
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        this.actionObj.clone.style.top = formatUnit(trCollection.item(rowIndex).offsetTop);
    };
    DragAndDrop.prototype.appendCloneElement = function (element) {
        if (this.parent.eventDragArea) {
            document.querySelector(this.parent.eventDragArea).appendChild(this.actionObj.clone);
        }
        else {
            element.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.getEventWrapper = function (index) {
        var eventWrapper;
        var isAllDayDrag = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
        if (this.parent.activeViewOptions.timeScale.enable) {
            var wrapperClass = isAllDayDrag ? '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index);
        }
        else {
            var targetWrapper = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS).item(index);
            eventWrapper = targetWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
            if (!eventWrapper) {
                eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    };
    DragAndDrop.prototype.getAllDayEventHeight = function () {
        var eventWrapper = createElement('div', { className: cls.APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        var eventHeight = eventWrapper.offsetHeight;
        remove(eventWrapper);
        return eventHeight;
    };
    DragAndDrop.prototype.isAllowDrop = function (e) {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        var dropSelectors = this.actionObj.excludeSelectors.split(',');
        var isAllowDrop = false;
        for (var _i = 0, dropSelectors_1 = dropSelectors; _i < dropSelectors_1.length; _i++) {
            var selector = dropSelectors_1[_i];
            if (e.target.classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    };
    /**
     * Get module name.
     */
    DragAndDrop.prototype.getModuleName = function () {
        return 'dragAndDrop';
    };
    return DragAndDrop;
}(ActionBase));
export { DragAndDrop };
