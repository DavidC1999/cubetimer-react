
export function formatMillis(millis) {
    let timeMin = Math.floor(millis / 60000).toString()
    let timeSecs = (Math.floor(millis / 1000) % 60).toString()
    let timeMillis = (Math.round(millis) % 1000).toString()

    if (timeMin.length === 1) timeMin = "0" + timeMin
    if (timeSecs.length === 1) timeSecs = "0" + timeSecs
    while (timeMillis.length < 3) timeMillis = "0" + timeMillis
    return timeMin + ':' + timeSecs + '.' + timeMillis
}

export function millisToSeconds(millis) {
    return "" + Math.floor(millis / 1000);
}

export function getMin(array) {
    if (array.length === 0) return null;
    return Math.min(...array);
}


export function getMax(array) {
    if (array.length === 0) return null;

    return Math.max(...array);
}

export function getMinAndMaxIdx(array) {
    if (array.length === 0) return null;
    let min = {
        val: array[0],
        idx: 0
    }
    let max = {
        val: array[0],
        idx: 0
    }
    for (let i = 0; i < array.length; ++i) {
        if (array[i] < min.val) {
            min = {
                val: array[i],
                idx: i
            }
        }
        if (array[i] > max.val) {
            max = {
                val: array[i],
                idx: i
            }
        }
    }
    return [min.idx, max.idx];
}

export function getAvg(array) {
    if (array.length === 0) return null;
    let total = array.reduce((total, num) => {
        return (total + num);
    });
    return total / array.length;
}