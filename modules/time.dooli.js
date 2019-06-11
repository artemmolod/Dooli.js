const time = {};
time.getTime = (timestamp) => Math.floor(+new Date() / 1000) + (timestamp || 0);
time.getRelativeDate = (timestamp) => {
    timestamp = timestamp * 1000;
    const DateObject = new Date(timestamp);
    const date = DateObject.toISOString().replace(/^([^T]+)T(.+)$/,'$1').replace(/^(\d+)-(\d+)-(\d+)$/,'$3.$2.$1');

    return date;
};
time.getTimestamp = (date) => Math.floor((new Date(date)).getTime() / 1000);
time.timer = (timer, callback, triggerEventTimer, triggerEvent) => {
    const now = Math.floor(Date.now() / 1000);
    const timeEnd = now + timer;
    const _timer = setInterval(() => {
        const time = Date.now() / 1000;
        if (Math.floor(time) >= timeEnd && typeof callback === 'function') {
            clearInterval(_timer);
            callback();
        }

        if (triggerEventTimer) {
            if (Math.floor(time % triggerEventTimer) === 0) {
                if (typeof triggerEvent === 'function') {
                    timer--;
                    const func = () => {
                        let days        = Math.floor(timer / 86400);
                        let hoursLeft   = Math.floor((timer) - (days * 86400));
                        let hours       = Math.floor(hoursLeft / 3600);
                        let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        let minutes     = Math.floor(minutesLeft / 60);
                        let seconds     = Math.floor(timer % 60);

                        if (days < 10)    days = `0${days}`;
                        if (hours < 10)   hours = `0${hours}`;
                        if (minutes < 10) minutes = `0${minutes}`;
                        if (seconds < 10) seconds = `0${seconds}`;

                        return {
                            days: days,
                            hours: hours,
                            minutes: minutes,
                            seconds: seconds,
                            timeEnd: timeEnd
                        };
                    };
                    const options = func();
                    triggerEvent(options);
                }
            }
        }
    }, 1000);
};

module.exports = time;
