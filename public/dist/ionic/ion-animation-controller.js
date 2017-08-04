/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
Ionic.defineComponents(

/**** module id (dev mode) ****/
'ion-animation-controller',

/**** component modules ****/
function importComponent(exports, h, t, Core, publicPath) {
var CSS_PROP = function (docEle) {
    var css = {};
    // transform
    var i;
    var keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transformProp = keys[i];
            break;
        }
    }
    // transition
    keys = ['webkitTransition', 'transition'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transitionProp = keys[i];
            break;
        }
    }
    // The only prefix we care about is webkit for transitions.
    var prefix = css.transitionProp.indexOf('webkit') > -1 ? '-webkit-' : '';
    // transition duration
    css.transitionDurationProp = prefix + 'transition-duration';
    // transition timing function
    css.transitionTimingFnProp = prefix + 'transition-timing-function';
    return css;
}(document.documentElement);
var TRANSFORM_PROPS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
var CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
var DURATION_MIN = 32;
var TRANSITION_END_FALLBACK_PADDING_MS = 400;

function transitionEnd(elm, callback) {
    var unRegTrans;
    var unRegWKTrans;
    var opts = { passive: true };
    function unregister() {
        unRegWKTrans && unRegWKTrans();
        unRegWKTrans && unRegTrans();
    }
    function onTransitionEnd(ev) {
        if (elm === ev.target) {
            unregister();
            callback(ev);
        }
    }
    if (elm) {
        elm.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
        unRegWKTrans = function () {
            elm.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
        };
        elm.addEventListener('transitionend', onTransitionEnd, opts);
        unRegWKTrans = function () {
            elm.removeEventListener('transitionend', onTransitionEnd, opts);
        };
    }
    return unregister;
}

var Animator = (function () {
    function Animator() {
        this._duration = null;
        this._easingName = null;
        this._elements = null;
        this._reversedEasingName = null;
        this._destroyed = false;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
    }
    Animator.prototype.addElement = function (elm) {
        if (elm) {
            if (elm.length) {
                for (var i = 0; i < elm.length; i++) {
                    this._addElm(elm[i]);
                }
            }
            else {
                this._addElm(elm);
            }
        }
        return this;
    };
    /**
     * NO DOM
     */
    Animator.prototype._addElm = function (elm) {
        if (elm.nodeType === 1) {
            this._elementTotal = (this._elements = this._elements || []).push(elm);
        }
    };
    /**
     * Add a child animation to this animation.
     */
    Animator.prototype.add = function (childAnimation) {
        childAnimation.parent = this;
        this.hasChildren = true;
        this._childAnimationTotal = (this._childAnimations = this._childAnimations || []).push(childAnimation);
        return this;
    };
    /**
     * Get the duration of this animation. If this animation does
     * not have a duration, then it'll get the duration from its parent.
     */
    Animator.prototype.getDuration = function (opts) {
        if (opts && opts.duration !== null && opts.duration !== undefined) {
            return opts.duration;
        }
        else if (this._duration !== null) {
            return this._duration;
        }
        else if (this.parent) {
            return this.parent.getDuration();
        }
        return 0;
    };
    /**
     * Returns if the animation is a root one.
     */
    Animator.prototype.isRoot = function () {
        return !this.parent;
    };
    /**
     * Set the duration for this animation.
     */
    Animator.prototype.duration = function (milliseconds) {
        this._duration = milliseconds;
        return this;
    };
    /**
     * Get the easing of this animation. If this animation does
     * not have an easing, then it'll get the easing from its parent.
     */
    Animator.prototype.getEasing = function () {
        if (this._isReverse && this._reversedEasingName) {
            return this._reversedEasingName;
        }
        return this._easingName !== null ? this._easingName : (this.parent && this.parent.getEasing()) || null;
    };
    /**
     * Set the easing for this animation.
     */
    Animator.prototype.easing = function (name) {
        this._easingName = name;
        return this;
    };
    /**
     * Set the easing for this reversed animation.
     */
    Animator.prototype.easingReverse = function (name) {
        this._reversedEasingName = name;
        return this;
    };
    /**
     * Add the "from" value for a specific property.
     */
    Animator.prototype.from = function (prop, val) {
        this._addProp('from', prop, val);
        return this;
    };
    /**
     * Add the "to" value for a specific property.
     */
    Animator.prototype.to = function (prop, val, clearProperyAfterTransition) {
        var fx = this._addProp('to', prop, val);
        if (clearProperyAfterTransition) {
            // if this effect is a transform then clear the transform effect
            // otherwise just clear the actual property
            this.afterClearStyles([fx.trans ? CSS_PROP.transformProp : prop]);
        }
        return this;
    };
    /**
     * Shortcut to add both the "from" and "to" for the same property.
     */
    Animator.prototype.fromTo = function (prop, fromVal, toVal, clearProperyAfterTransition) {
        return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
    };
    /**
     * @hidden
     * NO DOM
     */
    Animator.prototype._getProp = function (name) {
        if (this._fxProperties) {
            return this._fxProperties.find(function (prop) { return prop.effectName === name; });
        }
        else {
            this._fxProperties = [];
        }
        return null;
    };
    Animator.prototype._addProp = function (state, prop, val) {
        var fxProp = this._getProp(prop);
        if (!fxProp) {
            // first time we've see this EffectProperty
            var shouldTrans = (TRANSFORM_PROPS[prop] === 1);
            fxProp = {
                effectName: prop,
                trans: shouldTrans,
                // add the will-change property for transforms or opacity
                wc: (shouldTrans ? CSS_PROP.transformProp : prop)
            };
            this._fxProperties.push(fxProp);
        }
        // add from/to EffectState to the EffectProperty
        var fxState = {
            val: val,
            num: null,
            effectUnit: '',
        };
        fxProp[state] = fxState;
        if (typeof val === 'string' && val.indexOf(' ') < 0) {
            var r = val.match(CSS_VALUE_REGEX);
            var num = parseFloat(r[1]);
            if (!isNaN(num)) {
                fxState.num = num;
            }
            fxState.effectUnit = (r[0] !== r[2] ? r[2] : '');
        }
        else if (typeof val === 'number') {
            fxState.num = val;
        }
        return fxProp;
    };
    /**
     * Add CSS class to this animation's elements
     * before the animation begins.
     */
    Animator.prototype.beforeAddClass = function (className) {
        (this._beforeAddClasses = this._beforeAddClasses || []).push(className);
        return this;
    };
    /**
     * Remove CSS class from this animation's elements
     * before the animation begins.
     */
    Animator.prototype.beforeRemoveClass = function (className) {
        (this._beforeRemoveClasses = this._beforeRemoveClasses || []).push(className);
        return this;
    };
    /**
     * Set CSS inline styles to this animation's elements
     * before the animation begins.
     */
    Animator.prototype.beforeStyles = function (styles) {
        this._beforeStyles = styles;
        return this;
    };
    /**
     * Clear CSS inline styles from this animation's elements
     * before the animation begins.
     */
    Animator.prototype.beforeClearStyles = function (propertyNames) {
        this._beforeStyles = this._beforeStyles || {};
        for (var i = 0; i < propertyNames.length; i++) {
            this._beforeStyles[propertyNames[i]] = '';
        }
        return this;
    };
    /**
     * Add a function which contains DOM reads, which will run
     * before the animation begins.
     */
    Animator.prototype.beforeAddRead = function (domReadFn) {
        (this._readCallbacks = this._readCallbacks || []).push(domReadFn);
        return this;
    };
    /**
     * Add a function which contains DOM writes, which will run
     * before the animation begins.
     */
    Animator.prototype.beforeAddWrite = function (domWriteFn) {
        (this._writeCallbacks = this._writeCallbacks || []).push(domWriteFn);
        return this;
    };
    /**
     * Add CSS class to this animation's elements
     * after the animation finishes.
     */
    Animator.prototype.afterAddClass = function (className) {
        (this._afterAddClasses = this._afterAddClasses || []).push(className);
        return this;
    };
    /**
     * Remove CSS class from this animation's elements
     * after the animation finishes.
     */
    Animator.prototype.afterRemoveClass = function (className) {
        (this._afterRemoveClasses = this._afterRemoveClasses || []).push(className);
        return this;
    };
    /**
     * Set CSS inline styles to this animation's elements
     * after the animation finishes.
     */
    Animator.prototype.afterStyles = function (styles) {
        this._afterStyles = styles;
        return this;
    };
    /**
     * Clear CSS inline styles from this animation's elements
     * after the animation finishes.
     */
    Animator.prototype.afterClearStyles = function (propertyNames) {
        this._afterStyles = this._afterStyles || {};
        for (var i = 0; i < propertyNames.length; i++) {
            this._afterStyles[propertyNames[i]] = '';
        }
        return this;
    };
    /**
     * Play the animation.
     */
    Animator.prototype.play = function (opts) {
        var self = this;
        // If the animation was already invalidated (it did finish), do nothing
        if (self._destroyed) {
            return;
        }
        // this is the top level animation and is in full control
        // of when the async play() should actually kick off
        // if there is no duration then it'll set the TO property immediately
        // if there is a duration, then it'll stage all animations at the
        // FROM property and transition duration, wait a few frames, then
        // kick off the animation by setting the TO property for each animation
        self._isAsync = self._hasDuration(opts);
        // ensure all past transition end events have been cleared
        self._clearAsync();
        // recursively kicks off the correct progress step for each child animation
        // ******** DOM WRITE ****************
        self._playInit(opts);
        // doubling up RAFs since this animation was probably triggered
        // from an input event, and just having one RAF would have this code
        // run within the same frame as the triggering input event, and the
        // input event probably already did way too much work for one frame
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                self._playDomInspect(opts);
            });
        });
    };
    Animator.prototype.syncPlay = function () {
        // If the animation was already invalidated (it did finish), do nothing
        if (!this._destroyed) {
            var opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._playInit = function (opts) {
        // always default that an animation does not tween
        // a tween requires that an Animation class has an element
        // and that it has at least one FROM/TO effect
        // and that the FROM/TO effect can tween numeric values
        this._hasTweenEffect = false;
        this.isPlaying = true;
        this.hasCompleted = false;
        this._hasDur = (this.getDuration(opts) > DURATION_MIN);
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._playInit(opts);
        }
        if (this._hasDur) {
            // if there is a duration then we want to start at step 0
            // ******** DOM WRITE ****************
            this._progress(0);
            // add the will-change properties
            // ******** DOM WRITE ****************
            this._willChange(true);
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * NO RECURSION
     * ROOT ANIMATION
     */
    Animator.prototype._playDomInspect = function (opts) {
        var self = this;
        // fire off all the "before" function that have DOM READS in them
        // elements will be in the DOM, however visibily hidden
        // so we can read their dimensions if need be
        // ******** DOM READ ****************
        // ******** DOM WRITE ****************
        self._beforeAnimation();
        // for the root animation only
        // set the async TRANSITION END event
        // and run onFinishes when the transition ends
        var dur = self.getDuration(opts);
        if (self._isAsync) {
            self._asyncEnd(dur, true);
        }
        // ******** DOM WRITE ****************
        self._playProgress(opts);
        if (self._isAsync && !this._destroyed) {
            // this animation has a duration so we need another RAF
            // for the CSS TRANSITION properties to kick in
            window.requestAnimationFrame(function () {
                self._playToStep(1);
            });
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._playProgress = function (opts) {
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._playProgress(opts);
        }
        if (this._hasDur) {
            // set the CSS TRANSITION duration/easing
            // ******** DOM WRITE ****************
            this._setTrans(this.getDuration(opts), false);
        }
        else {
            // this animation does not have a duration, so it should not animate
            // just go straight to the TO properties and call it done
            // ******** DOM WRITE ****************
            this._progress(1);
            // since there was no animation, immediately run the after
            // ******** DOM WRITE ****************
            this._setAfterStyles();
            // this animation has no duration, so it has finished
            // other animations could still be running
            this._didFinish(true);
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._playToStep = function (stepValue) {
        if (!this._destroyed) {
            var children = this._childAnimations;
            for (var i = 0; i < this._childAnimationTotal; i++) {
                // ******** DOM WRITE ****************
                children[i]._playToStep(stepValue);
            }
            if (this._hasDur) {
                // browser had some time to render everything in place
                // and the transition duration/easing is set
                // now set the TO properties which will trigger the transition to begin
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * NO RECURSION
     * ROOT ANIMATION
     */
    Animator.prototype._asyncEnd = function (dur, shouldComplete) {
        var self = this;
        function onTransitionEnd() {
            // congrats! a successful transition completed!
            // ensure transition end events and timeouts have been cleared
            self._clearAsync();
            // ******** DOM WRITE ****************
            self._playEnd();
            // transition finished
            self._didFinishAll(shouldComplete, true, false);
        }
        function onTransitionFallback() {
            console.debug('Animation onTransitionFallback, CSS onTransitionEnd did not fire!');
            // oh noz! the transition end event didn't fire in time!
            // instead the fallback timer when first
            // if all goes well this fallback should never fire
            // clear the other async end events from firing
            self._timerId = undefined;
            self._clearAsync();
            // set the after styles
            // ******** DOM WRITE ****************
            self._playEnd(shouldComplete ? 1 : 0);
            // transition finished
            self._didFinishAll(shouldComplete, true, false);
        }
        // set the TRANSITION END event on one of the transition elements
        self._unregisterTrnsEnd = transitionEnd(self._transEl(), onTransitionEnd);
        // set a fallback timeout if the transition end event never fires, or is too slow
        // transition end fallback: (animation duration + XXms)
        self._timerId = setTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._playEnd = function (stepValue) {
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._playEnd(stepValue);
        }
        if (this._hasDur) {
            if (stepValue !== null && stepValue !== undefined) {
                // too late to have a smooth animation, just finish it
                // ******** DOM WRITE ****************
                this._setTrans(0, true);
                // ensure the ending progress step gets rendered
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
            // set the after styles
            // ******** DOM WRITE ****************
            this._setAfterStyles();
            // remove the will-change properties
            // ******** DOM WRITE ****************
            this._willChange(false);
        }
    };
    /**
     * @hidden
     * NO DOM
     * RECURSION
     */
    Animator.prototype._hasDuration = function (opts) {
        if (this.getDuration(opts) > DURATION_MIN) {
            return true;
        }
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            if (children[i]._hasDuration(opts)) {
                return true;
            }
        }
        return false;
    };
    /**
     * @hidden
     * NO DOM
     * RECURSION
     */
    Animator.prototype._hasDomReads = function () {
        if (this._readCallbacks && this._readCallbacks.length) {
            return true;
        }
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            if (children[i]._hasDomReads()) {
                return true;
            }
        }
        return false;
    };
    /**
     * Immediately stop at the end of the animation.
     */
    Animator.prototype.stop = function (stepValue) {
        if (stepValue === undefined) {
            stepValue = 1;
        }
        // ensure all past transition end events have been cleared
        this._clearAsync();
        this._hasDur = true;
        this._playEnd(stepValue);
    };
    /**
     * @hidden
     * NO DOM
     * NO RECURSION
     */
    Animator.prototype._clearAsync = function () {
        this._unregisterTrnsEnd && this._unregisterTrnsEnd();
        this._timerId && clearTimeout(this._timerId);
        this._timerId = this._unregisterTrnsEnd = undefined;
    };
    /**
     * @hidden
     * DOM WRITE
     * NO RECURSION
     */
    Animator.prototype._progress = function (stepValue) {
        // bread 'n butter
        var val;
        var effects = this._fxProperties;
        var nuElements = this._elementTotal;
        if (!effects || !nuElements || this._destroyed) {
            return;
        }
        // flip the number if we're going in reverse
        if (this._isReverse) {
            stepValue = ((stepValue * -1) + 1);
        }
        var i = 0;
        var j = 0;
        var finalTransform = '';
        var elements = this._elements;
        var fx;
        for (i = 0; i < effects.length; i++) {
            fx = effects[i];
            if (fx.from && fx.to) {
                var fromNum = fx.from.num;
                var toNum = fx.to.num;
                var tweenEffect = (fromNum !== toNum);
                if (tweenEffect) {
                    this._hasTweenEffect = true;
                }
                if (stepValue === 0) {
                    // FROM
                    val = fx.from.val;
                }
                else if (stepValue === 1) {
                    // TO
                    val = fx.to.val;
                }
                else if (tweenEffect) {
                    // EVERYTHING IN BETWEEN
                    var valNum = (((toNum - fromNum) * stepValue) + fromNum);
                    var unit = fx.to.effectUnit;
                    if (unit === 'px') {
                        valNum = Math.round(valNum);
                    }
                    val = valNum + unit;
                }
                if (val !== null) {
                    var prop = fx.effectName;
                    if (fx.trans) {
                        finalTransform += prop + '(' + val + ') ';
                    }
                    else {
                        for (j = 0; j < nuElements; j++) {
                            // ******** DOM WRITE ****************
                            elements[j].style[prop] = val;
                        }
                    }
                }
            }
        }
        // place all transforms on the same property
        if (finalTransform.length) {
            if (!this._isReverse && stepValue !== 1 || this._isReverse && stepValue !== 0) {
                finalTransform += 'translateZ(0px)';
            }
            for (i = 0; i < elements.length; i++) {
                // ******** DOM WRITE ****************
                elements[i].style[CSS_PROP.transformProp] = finalTransform;
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * NO RECURSION
     */
    Animator.prototype._setTrans = function (dur, forcedLinearEasing) {
        // Transition is not enabled if there are not effects
        if (!this._fxProperties) {
            return;
        }
        // set the TRANSITION properties inline on the element
        var elements = this._elements;
        var easing = (forcedLinearEasing ? 'linear' : this.getEasing());
        var durString = dur + 'ms';
        var cssTransform = CSS_PROP.transitionProp;
        var cssTransitionDuration = CSS_PROP.transitionDurationProp;
        var cssTransitionTimingFn = CSS_PROP.transitionTimingFnProp;
        var eleStyle;
        for (var i = 0; i < this._elementTotal; i++) {
            eleStyle = elements[i].style;
            if (dur > 0) {
                // ******** DOM WRITE ****************
                eleStyle[cssTransform] = '';
                eleStyle[cssTransitionDuration] = durString;
                // each animation can have a different easing
                if (easing) {
                    // ******** DOM WRITE ****************
                    eleStyle[cssTransitionTimingFn] = easing;
                }
            }
            else {
                eleStyle[cssTransform] = 'none';
            }
        }
    };
    /**
     * @hidden
     * DOM READ
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._beforeAnimation = function () {
        // fire off all the "before" function that have DOM READS in them
        // elements will be in the DOM, however visibily hidden
        // so we can read their dimensions if need be
        // ******** DOM READ ****************
        this._fireBeforeReadFunc();
        // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
        // fire off all the "before" function that have DOM WRITES in them
        // ******** DOM WRITE ****************
        this._fireBeforeWriteFunc();
        // stage all of the before css classes and inline styles
        // ******** DOM WRITE ****************
        this._setBeforeStyles();
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._setBeforeStyles = function () {
        var i, j;
        var children = this._childAnimations;
        for (i = 0; i < this._childAnimationTotal; i++) {
            children[i]._setBeforeStyles();
        }
        // before the animations have started
        // only set before styles if animation is not reversed
        if (this._isReverse) {
            return;
        }
        var addClasses = this._beforeAddClasses;
        var removeClasses = this._beforeRemoveClasses;
        var elm;
        var elementClassList;
        var prop;
        for (i = 0; i < this._elementTotal; i++) {
            elm = this._elements[i];
            elementClassList = elm.classList;
            // css classes to add before the animation
            if (addClasses) {
                for (j = 0; j < addClasses.length; j++) {
                    // ******** DOM WRITE ****************
                    elementClassList.add(addClasses[j]);
                }
            }
            // css classes to remove before the animation
            if (removeClasses) {
                for (j = 0; j < removeClasses.length; j++) {
                    // ******** DOM WRITE ****************
                    elementClassList.remove(removeClasses[j]);
                }
            }
            // inline styles to add before the animation
            if (this._beforeStyles) {
                for (prop in this._beforeStyles) {
                    // ******** DOM WRITE ****************
                    elm.style[prop] = this._beforeStyles[prop];
                }
            }
        }
    };
    /**
     * @hidden
     * DOM READ
     * RECURSION
     */
    Animator.prototype._fireBeforeReadFunc = function () {
        var children = this._childAnimations;
        var i = 0;
        for (i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM READ ****************
            children[i]._fireBeforeReadFunc();
        }
        var readFunctions = this._readCallbacks;
        if (readFunctions) {
            for (i = 0; i < readFunctions.length; i++) {
                // ******** DOM READ ****************
                readFunctions[i]();
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._fireBeforeWriteFunc = function () {
        var children = this._childAnimations;
        var i = 0;
        for (i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._fireBeforeWriteFunc();
        }
        var writeFunctions = this._writeCallbacks;
        if (this._writeCallbacks) {
            for (i = 0; i < writeFunctions.length; i++) {
                // ******** DOM WRITE ****************
                writeFunctions[i]();
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     */
    Animator.prototype._setAfterStyles = function () {
        var i, j;
        var elm;
        var elementClassList;
        var elements = this._elements;
        var prop;
        for (i = 0; i < this._elementTotal; i++) {
            elm = elements[i];
            elementClassList = elm.classList;
            // remove the transition duration/easing
            // ******** DOM WRITE ****************
            elm.style[CSS_PROP.transitionDurationProp] = elm.style[CSS_PROP.transitionTimingFnProp] = '';
            if (this._isReverse) {
                // finished in reverse direction
                // css classes that were added before the animation should be removed
                if (this._beforeAddClasses) {
                    for (j = 0; j < this._beforeAddClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        elementClassList.remove(this._beforeAddClasses[j]);
                    }
                }
                // css classes that were removed before the animation should be added
                if (this._beforeRemoveClasses) {
                    for (j = 0; j < this._beforeRemoveClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        elementClassList.add(this._beforeRemoveClasses[j]);
                    }
                }
                // inline styles that were added before the animation should be removed
                if (this._beforeStyles) {
                    for (prop in this._beforeStyles) {
                        // ******** DOM WRITE ****************
                        elm.style[prop] = '';
                    }
                }
            }
            else {
                // finished in forward direction
                // css classes to add after the animation
                if (this._afterAddClasses) {
                    for (j = 0; j < this._afterAddClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        elementClassList.add(this._afterAddClasses[j]);
                    }
                }
                // css classes to remove after the animation
                if (this._afterRemoveClasses) {
                    for (j = 0; j < this._afterRemoveClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        elementClassList.remove(this._afterRemoveClasses[j]);
                    }
                }
                // inline styles to add after the animation
                if (this._afterStyles) {
                    for (prop in this._afterStyles) {
                        // ******** DOM WRITE ****************
                        elm.style[prop] = this._afterStyles[prop];
                    }
                }
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * NO RECURSION
     */
    Animator.prototype._willChange = function (addWillChange) {
        var i = 0;
        var wc;
        var effects = this._fxProperties;
        var willChange;
        if (addWillChange && effects) {
            wc = [];
            for (i = 0; i < effects.length; i++) {
                var propWC = effects[i].wc;
                if (propWC === 'webkitTransform') {
                    wc.push('transform', '-webkit-transform');
                }
                else {
                    wc.push(propWC);
                }
            }
            willChange = wc.join(',');
        }
        else {
            willChange = '';
        }
        for (i = 0; i < this._elementTotal; i++) {
            // ******** DOM WRITE ****************
            this._elements[i].style.willChange = willChange;
        }
    };
    /**
     * Start the animation with a user controlled progress.
     */
    Animator.prototype.progressStart = function () {
        // ensure all past transition end events have been cleared
        this._clearAsync();
        // ******** DOM READ/WRITE ****************
        this._beforeAnimation();
        // ******** DOM WRITE ****************
        this._progressStart();
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._progressStart = function () {
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._progressStart();
        }
        // force no duration, linear easing
        // ******** DOM WRITE ****************
        this._setTrans(0, true);
        // ******** DOM WRITE ****************
        this._willChange(true);
    };
    /**
     * Set the progress step for this animation.
     * progressStep() is not debounced, so it should not be called faster than 60FPS.
     */
    Animator.prototype.progressStep = function (stepValue) {
        // only update if the last update was more than 16ms ago
        stepValue = Math.min(1, Math.max(0, stepValue));
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i].progressStep(stepValue);
        }
        if (this._isReverse) {
            // if the animation is going in reverse then
            // flip the step value: 0 becomes 1, 1 becomes 0
            stepValue = ((stepValue * -1) + 1);
        }
        // ******** DOM WRITE ****************
        this._progress(stepValue);
    };
    /**
     * End the progress animation.
     */
    Animator.prototype.progressEnd = function (shouldComplete, currentStepValue, dur) {
        var self = this;
        if (dur === undefined) {
            dur = -1;
        }
        if (self._isReverse) {
            // if the animation is going in reverse then
            // flip the step value: 0 becomes 1, 1 becomes 0
            currentStepValue = ((currentStepValue * -1) + 1);
        }
        var stepValue = shouldComplete ? 1 : 0;
        var diff = Math.abs(currentStepValue - stepValue);
        if (diff < 0.05) {
            dur = 0;
        }
        else if (dur < 0) {
            dur = self._duration;
        }
        self._isAsync = (dur > 30);
        self._progressEnd(shouldComplete, stepValue, dur, self._isAsync);
        if (self._isAsync) {
            // for the root animation only
            // set the async TRANSITION END event
            // and run onFinishes when the transition ends
            // ******** DOM WRITE ****************
            self._asyncEnd(dur, shouldComplete);
            // this animation has a duration so we need another RAF
            // for the CSS TRANSITION properties to kick in
            if (!self._destroyed) {
                window.requestAnimationFrame(function () {
                    self._playToStep(stepValue);
                });
            }
        }
    };
    /**
     * @hidden
     * DOM WRITE
     * RECURSION
     */
    Animator.prototype._progressEnd = function (shouldComplete, stepValue, dur, isAsync) {
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            // ******** DOM WRITE ****************
            children[i]._progressEnd(shouldComplete, stepValue, dur, isAsync);
        }
        if (!isAsync) {
            // stop immediately
            // set all the animations to their final position
            // ******** DOM WRITE ****************
            this._progress(stepValue);
            this._willChange(false);
            this._setAfterStyles();
            this._didFinish(shouldComplete);
        }
        else {
            // animate it back to it's ending position
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = true;
            // ******** DOM WRITE ****************
            this._willChange(true);
            this._setTrans(dur, false);
        }
    };
    /**
     * Add a callback to fire when the animation has finished.
     */
    Animator.prototype.onFinish = function (callback, opts) {
        if (opts && opts.clearExistingCallacks) {
            this._onFinishCallbacks = this._onFinishOneTimeCallbacks = undefined;
        }
        if (opts && opts.oneTimeCallback) {
            this._onFinishOneTimeCallbacks = this._onFinishOneTimeCallbacks || [];
            this._onFinishOneTimeCallbacks.push(callback);
        }
        else {
            this._onFinishCallbacks = this._onFinishCallbacks || [];
            this._onFinishCallbacks.push(callback);
        }
        return this;
    };
    /**
     * @hidden
     * NO DOM
     * RECURSION
     */
    Animator.prototype._didFinishAll = function (hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            children[i]._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
        }
        if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
            this._didFinish(hasCompleted);
        }
    };
    /**
     * @hidden
     * NO RECURSION
     */
    Animator.prototype._didFinish = function (hasCompleted) {
        this.isPlaying = false;
        this.hasCompleted = hasCompleted;
        var i = 0;
        if (this._onFinishCallbacks) {
            // run all finish callbacks
            for (i = 0; i < this._onFinishCallbacks.length; i++) {
                this._onFinishCallbacks[i](this);
            }
        }
        if (this._onFinishOneTimeCallbacks) {
            // run all "onetime" finish callbacks
            for (i = 0; i < this._onFinishOneTimeCallbacks.length; i++) {
                this._onFinishOneTimeCallbacks[i](this);
            }
            this._onFinishOneTimeCallbacks.length = 0;
        }
    };
    /**
     * Reverse the animation.
     */
    Animator.prototype.reverse = function (shouldReverse) {
        if (shouldReverse === undefined) {
            shouldReverse = true;
        }
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            children[i].reverse(shouldReverse);
        }
        this._isReverse = shouldReverse;
        return this;
    };
    /**
     * Recursively destroy this animation and all child animations.
     */
    Animator.prototype.destroy = function () {
        this._destroyed = true;
        var children = this._childAnimations;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            children[i].destroy();
        }
        this._clearAsync();
        if (this._elements) {
            this._elements.length = this._elementTotal = 0;
        }
        if (this._readCallbacks) {
            this._readCallbacks.length = 0;
        }
        if (this._writeCallbacks) {
            this._writeCallbacks.length = 0;
        }
        this.parent = null;
        if (this._childAnimations) {
            this._childAnimations.length = this._childAnimationTotal = 0;
        }
        if (this._onFinishCallbacks) {
            this._onFinishCallbacks.length = 0;
        }
        if (this._onFinishOneTimeCallbacks) {
            this._onFinishOneTimeCallbacks.length = 0;
        }
    };
    /**
     * @hidden
     * NO DOM
     */
    Animator.prototype._transEl = function () {
        // get the lowest level element that has an Animation
        var targetEl;
        for (var i = 0; i < this._childAnimationTotal; i++) {
            targetEl = this._childAnimations[i]._transEl();
            if (targetEl) {
                return targetEl;
            }
        }
        return (this._hasTweenEffect && this._hasDur && this._elementTotal ? this._elements[0] : null);
    };
    return Animator;
}());

/**
 * iOS Loading Enter Animation
 */

/**
 * iOS Loading Leave Animation
 */

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
var MenuType = (function () {
    function MenuType() {
        // Ionic.createAnimation().then(Animation => {
        //   this.ani = new Animation();
        // });;
        // this.ani
        //   .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
        //   .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
        //   .duration(280);
    }
    MenuType.prototype.setOpen = function (shouldOpen, animated, done) {
        var ani = this.ani
            .onFinish(done, { oneTimeCallback: true, clearExistingCallacks: true })
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
    };
    MenuType.prototype.setProgressStart = function (isOpen) {
        this.isOpening = !isOpen;
        // the cloned animation should not use an easing curve during seek
        this.ani
            .reverse(isOpen)
            .progressStart();
    };
    MenuType.prototype.setProgessStep = function (stepValue) {
        // adjust progress value depending if it opening or closing
        this.ani.progressStep(stepValue);
    };
    MenuType.prototype.setProgressEnd = function (shouldComplete, currentStepValue, velocity, done) {
        var _this = this;
        var isOpen = (this.isOpening && shouldComplete);
        if (!this.isOpening && !shouldComplete) {
            isOpen = true;
        }
        var ani = this.ani;
        ani.onFinish(function () {
            _this.isOpening = false;
            done(isOpen);
        }, { clearExistingCallacks: true });
        var factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
        var dur = ani.getDuration() * factor;
        ani.progressEnd(shouldComplete, currentStepValue, dur);
    };
    MenuType.prototype.destroy = function () {
        this.ani.destroy();
        this.ani = null;
    };
    return MenuType;
}());
/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealType = (function (_super) {
    __extends(MenuRevealType, _super);
    function MenuRevealType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MenuRevealType;
}(MenuType));
/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushType = (function (_super) {
    __extends(MenuPushType, _super);
    function MenuPushType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MenuPushType;
}(MenuType));
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayType = (function (_super) {
    __extends(MenuOverlayType, _super);
    function MenuOverlayType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MenuOverlayType;
}(MenuType));

/**
 * iOS Modal Enter Animation
 */

/**
 * Animations for modals
 */
// export function modalSlideIn(rootElm: HTMLElement) {
// }
// export class ModalSlideOut {
//   constructor(ele: HTMLElement) {
//     let backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
//     let wrapperEle = <HTMLElement>ele.querySelector('.modal-wrapper');
//     let wrapperEleRect = wrapperEle.getBoundingClientRect();
//     let wrapper = new Animation(this.plt, wrapperEle);
//     // height of the screen - top of the container tells us how much to scoot it down
//     // so it's off-screen
//     wrapper.fromTo('translateY', '0px', `${this.plt.height() - wrapperEleRect.top}px`);
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     this
//       .element(this.leavingView.pageRef())
//       .easing('ease-out')
//       .duration(250)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideIn {
//   constructor(ele: HTMLElement) {
//     const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.01, 0.4);
//     wrapper.fromTo('translateY', '40px', '0px');
//     wrapper.fromTo('opacity', 0.01, 1);
//     const DURATION = 280;
//     const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
//     this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideOut {
//   constructor(ele: HTMLElement) {
//     const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     wrapper.fromTo('translateY', '0px', '40px');
//     wrapper.fromTo('opacity', 0.99, 0);
//     this
//       .element(this.leavingView.pageRef())
//       .duration(200)
//       .easing('cubic-bezier(0.47,0,0.745,0.715)')
//       .add(wrapper)
//       .add(backdrop);
//   }
// }

/**
 * iOS Modal Leave Animation
 */

var Ionic = window.Ionic;

var AnimationController$$1 = (function () {
    function AnimationController$$1() {
    }
    AnimationController$$1.prototype["componentWillLoad"] = function () {
        debugger;
        
        
        Ionic.registerController('animation', this);
    };
    AnimationController$$1.prototype.load = function () {
        return new Promise(function (resolve) {
            debugger;
            resolve(Animator);
        });
    };
    return AnimationController$$1;
}());

exports['ION-ANIMATION-CONTROLLER'] = AnimationController$$1;
},


/***************** ion-animation-controller *****************/
[
/** ion-animation-controller: [0] tag **/
'ION-ANIMATION-CONTROLLER',

/** ion-animation-controller: [1] host **/
{}

]
)