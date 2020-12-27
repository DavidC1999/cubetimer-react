
export default class Settings {
    constructor() {
        this.settings = {
            "inspection": true,
            "inspection_time": 2000,
            "scramble_type": '3x3',
            "scramble_length": 20
        }
    }

    update(name, value) {
        this.settings[name] = value;
        return this;
    }

    get(name) {
        return this.settings[name];
    }

    *[Symbol.iterator]() {
        // // get the properties of the object 
        // let properties = Object.keys(this);
        // let count = 0;
        // // set to true when the loop is done 
        // let isDone = false;

        // // define the next method, need for iterator 
        // let next = () => {
        //     // control on last property reach 
        //     if (count >= properties.length) {
        //         isDone = true;
        //     }
        //     return { done: isDone, value: this[properties[count++]] };
        // }

        // // return the next method used to iterate 
        // return { next };
        for (let key in this) {
            yield[key, this[key]] // yield [key, value] pair
        }
    }
}