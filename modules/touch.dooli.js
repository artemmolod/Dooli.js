const touch = {};
touch.SENSITIVITY_X = 160;
touch.SENSITIVITY_Y = 160;
touch.callbacks = {
    callbackTouchTop:    () => console.log('Верхний тач'),
    callbackTouchLeft:   () => console.log('Левый тач'),
    callbackTouchBottom: () => console.log('Нижний тач'),
    callbackTouchRight:  () => console.log('Правый тач'),
};
touch.isEnabledTouchEvent = () => !!('ontouchstart' in window);
touch.onStart = function(event) {
    event  = event || window.event;
    touch.startPoint = event.changedTouches[0];
};
touch.onEnded = function(event) {
    event  = event || window.event;
    touch.endPoint = event.changedTouches[0];
    const coordsX = Math.abs(touch.startPoint.pageX - touch.endPoint.pageX);
    const coordsY = Math.abs(touch.startPoint.pageY - touch.endPoint.pageY);

    if (coordsX > touch.SENSITIVITY_X || coordsY > touch.SENSITIVITY_Y) {
        if (coordsX > coordsY) {
            if (touch.endPoint.pageX < touch.startPoint.pageX) {
                if (typeof touch.callbacks.callbackTouchLeft === 'function') {
                    touch.callbacks.callbackTouchLeft();
                }
            } else {
                if (typeof touch.callbacks.callbackTouchRight === 'function') {
                    touch.callbacks.callbackTouchRight();
                }
            }
        } else {
            if (touch.endPoint.pageY < touch.startPoint.pageY) {
                if (typeof touch.callbacks.callbackTouchTop === 'function') {
                    touch.callbacks.callbackTouchTop();
                }
            } else {
                if (typeof touch.callbacks.callbackTouchBottom === 'function') {
                    touch.callbacks.callbackTouchBottom();
                }
            }
        }
    }
};

Dooli(document).bindMultiple(null, {
    touchstart: touch.onStart.bind(this),
    touchend: touch.onEnded.bind(this),
});

export default touch;
