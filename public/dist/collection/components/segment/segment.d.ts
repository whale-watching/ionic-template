import { HostElement, EventEmitter } from '@stencil/core';
/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular's `ngModel` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/forms/index/FormBuilder-class.html)
 *
 *
 * ```html
 * <!-- Segment in a header -->
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-segment [(ngModel)]="icons" color="secondary">
 *       <ion-segment-button value="camera">
 *         <ion-icon name="camera"></ion-icon>
 *       </ion-segment-button>
 *       <ion-segment-button value="bookmark">
 *         <ion-icon name="bookmark"></ion-icon>
 *       </ion-segment-button>
 *     </ion-segment>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 *   <!-- Segment in content -->
 *   <ion-segment [(ngModel)]="relationship" color="primary" (ionChange)="segmentChanged($event)">
 *     <ion-segment-button value="friends">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment in a form -->
 *   <form [formGroup]="myForm">
 *     <ion-segment formControlName="mapStyle" color="danger">
 *       <ion-segment-button value="standard">
 *         Standard
 *       </ion-segment-button>
 *       <ion-segment-button value="hybrid">
 *         Hybrid
 *       </ion-segment-button>
 *       <ion-segment-button value="sat">
 *         Satellite
 *       </ion-segment-button>
 *     </ion-segment>
 *   </form>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see [Angular Forms](http://learnangular2.com/forms/)
 */
export declare class Segment {
    buttons: NodeListOf<HostElement>;
    el: HTMLElement;
    ionChange: EventEmitter;
    disabled: boolean;
    value: string;
    changed(val: string): void;
    ionViewDidLoad(): void;
    segmentClick(ev: CustomEvent): void;
    selectButton(val: string): boolean;
    hostData(): {
        class: {
            'segment-disabled': boolean;
        };
    };
    render(): JSX.Element;
}
export interface SegmentEvent {
    segment: Segment;
}
