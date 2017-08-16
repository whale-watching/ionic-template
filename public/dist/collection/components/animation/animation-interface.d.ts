export interface Animation {
    new (): Animation;
    parent: Animation;
    addElement(elm: Node | Node[] | NodeList): Animation;
    add(childAnimation: Animation): Animation;
    duration(milliseconds: number): Animation;
    easing(name: string): Animation;
    easingReverse(name: string): Animation;
    getDuration(opts?: PlayOptions): number;
    getEasing(): string;
    from(prop: string, val: any): Animation;
    to(prop: string, val: any, clearProperyAfterTransition?: boolean): Animation;
    fromTo(prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean): Animation;
    beforeAddClass(className: string): Animation;
    beforeRemoveClass(className: string): Animation;
    beforeStyles(styles: {
        [property: string]: any;
    }): Animation;
    beforeClearStyles(propertyNames: string[]): Animation;
    beforeAddRead(domReadFn: Function): Animation;
    beforeAddWrite(domWriteFn: Function): Animation;
    afterAddClass(className: string): Animation;
    afterRemoveClass(className: string): Animation;
    afterStyles(styles: {
        [property: string]: any;
    }): Animation;
    afterClearStyles(propertyNames: string[]): Animation;
    play(opts?: PlayOptions): void;
    syncPlay(): void;
    reverse(shouldReverse?: boolean): Animation;
    stop(stepValue?: number): void;
    progressStart(): void;
    progressStep(stepValue: number): void;
    progressEnd(shouldComplete: boolean, currentStepValue: number, dur: number): void;
    onFinish(callback: (animation?: Animation) => void, opts?: {
        oneTimeCallback?: boolean;
        clearExistingCallacks?: boolean;
    }): Animation;
    destroy(): void;
}
export interface AnimationBuilder {
    (Animation: Animation, baseElm?: HTMLElement): Animation;
}
export interface AnimationOptions {
    animation?: string;
    duration?: number;
    easing?: string;
    direction?: string;
    isRTL?: boolean;
    ev?: any;
}
export interface PlayOptions {
    duration?: number;
    promise?: boolean;
}
export interface EffectProperty {
    effectName: string;
    trans: boolean;
    wc?: string;
    to?: EffectState;
    from?: EffectState;
    [state: string]: any;
}
export interface EffectState {
    val: any;
    num: number;
    effectUnit: string;
}
