import { formatMillis } from './helperFunctions';

export default class Time {
    constructor(millis, scramble, plusTwo, dnf) {
        this.millis = millis;
        this.scramble = scramble;
        this.plusTwo = plusTwo;
        this.dnf = dnf;
        console.log(`new time object with scramble ${this.scramble}`);
    }

    getTime() {
        return this.millis + (this.plusTwo ? 2000 : 0);
    }

    getScramble() {
        return this.scramble
    }

    getString() {
        return formatMillis(this.getTime());
    }


}