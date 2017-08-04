/**
 * iOS Loading Leave Animation
 */
export default function (Animation, baseElm) {
    var baseAnimation = new Animation();
    var backdropAnimation = new Animation();
    backdropAnimation.addElement(baseElm.querySelector('.loading-backdrop'));
    var wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0)
        .fromTo('scale', 1, 0.9);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
}
