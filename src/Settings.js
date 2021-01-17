class MultComputation {
    constructor(multBy) {
        this.multBy = multBy;
    }

    execute(input) {
        return input * this.multBy;
    }
}

export default class Settings {
    constructor(initialSettings) {
        // this.settings = {
        //     "inspection": true,
        //     "inspection_time": 2000,
        //     "scramble_type": '3x3',
        //     "scramble_length": 20
        // }
        if (!initialSettings)
            this.settings = [
                {
                    "name": "inspection",
                    "pretty name": "Inspection",
                    "type": "boolean",
                    "value": true
                },
                {
                    "name": "inspection_time",
                    "pretty name": "Inspection Time (s)",
                    "type": "number",
                    "value": 2,
                    "computation": new MultComputation(1000) // when getting this value it will be multiplied by 1000
                },
                {
                    "name": "scramble_type",
                    "pretty name": "Scramble Type",
                    "type": "option",
                    "value": "3x3",
                    "options": [
                        "2x2",
                        "3x3"
                    ]
                },
                {
                    "name": "scramble_length",
                    "pretty name": "Scramble Length",
                    "type": "number",
                    "value": 20
                },
                {
                    "name": "manual_enter",
                    "pretty name": "Manually enter times",
                    "type": "boolean",
                    "value": false
                },
            ];
        else
            this.settings = initialSettings;
        this.nameToIdx = {};
        this.generateIndex();
        this.setDefaults();
    }


    setDefaults() {
        for (let i = 0; i < this.settings.length; ++i) {
            let fromLocalStorage = localStorage.getItem(`setting_${this.settings[i].name}`);
            if (fromLocalStorage) {
                let [type, value] = fromLocalStorage.split(':');
                // if(type === "boolean") value = value === 'true';
                switch (type) {
                    case "boolean":
                        value = value === "true";
                        break;
                    case "number":
                        value = parseFloat(value);
                        break;
                }
                this.settings[i].value = value;
            }
        }
        console.table(this.settings)
    }

    generateIndex() {
        this.nameToIdx = {};
        for (let i = 0; i < this.settings.length; ++i) {
            this.nameToIdx[this.settings[i].name] = i;
        }
    }

    update(name, value) {
        let idx = this.nameToIdx[name];

        if (typeof idx == "number") {
            let setting = this.settings[idx];
            if (setting.type === "option") {
                if (setting.options.indexOf(value) === -1) throw new Error(`Invalid option for setting ${name}`);
            }
            else {
                if (typeof value !== setting.type) throw new Error(`Invalid type "${typeof value}" for setting ${name}`);
            }

            this.settings[idx].value = value;
            localStorage.setItem(`setting_${this.settings[idx].name}`, `${this.settings[idx].type}:${this.settings[idx].value}`);
        } else {
            throw new Error("Can't update setting that does not exist");
        }

        return this;
    }

    getValue(name) {
        let idx = this.nameToIdx[name];

        let returnVal = this.settings[idx].value;
        if (this.settings[idx]["computation"]) {
            let computation = this.settings[idx]["computation"];
            returnVal = computation.execute(returnVal);
        }

        return returnVal;
    }

    getType(name) {
        let idx = this.nameToIdx[name];
        return this.settings[idx].type;
    }

    getAll() {
        return this.settings;
    }

    createCopy() {
        return new Settings(this.settings);
    }

    *[Symbol.iterator]() {
        for (let key in this) {
            yield [key, this[key]];
        }
    }
}