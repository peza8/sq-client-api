/**
 * Model class for a Self Quants event type
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 01/11/2020
 */

const UUID = require('uuid-v4');

/**
 * Type of lookup table for valid: 
 *      1. dates
 *      2. spheres
 *      3. metrics
 */

const ValidEntries = {
 // Spheres    [Metrics]
    physical:  ["exercise", "intensity_minutes", "rhr", "sleep", "weight", "body_fat","illness","toxin"],
    mental:    ["input_stream", "meditation", "stress", "deep_focus", "screen_time"],
    spiritual: ["spiritual_exp", "social_int", "gratitude_exc", "happiness", "motivation", "contentment"]
};

class SQEvent {
    constructor(_date, _sphere, _metric, _data_01, _data_02="None") {
        this.uid = UUID();
        this.date = _date;
        this.timestamp = this.getTimestampFromDate(_date);
        this.sphere = _sphere;
        this.metric = _metric;
        this.data_01 = _data_01;
        this.data_02 = _data_02;
        let dateObj = new Date();
        this.entered = dateObj.getTime();
    }

    getEventJSON() {
        return {
            uid:        this.uid,
            date:       this.date,
            timestamp:  this.timestamp,
            sphere:     this.sphere,
            metric:     this.metric,
            data_01:    this.data_01,
            data_02:    this.data_02,
            entered:    this.entered
        }
    }

    // Create a timestamp from a date entry
    getTimestampFromDate(dateEntry) {
        const dateComponents = dateEntry.split("/");
        const day = Number(dateComponents[0]);
        const month = Number(dateComponents[1]) - 1; // months are 0 indexed
        const year = Number(dateComponents[2]);

        const dateObj = new Date(year, month, day, 12, 0);     // All events are at 12pm for searchability
        return dateObj.getTime();
    }

    validateEvent() {
        const validEntry = this.validDate() && this.validSphere() && this.validMetric();
        return validEntry;
    }

    // Format needs to be dd/mm/yyyy
    validDate() {
        dateComponents = this.date.split("/");
        validDay   = Number(dateComponents[0]) > 0 && Number(dateComponents[0]) < 32;
        validMonth = Number(dateComponents[1]) > 0 && Number(dateComponents[1]) < 13;
        validYear  = Number(dateComponents[2]) > 2019 && Number(dateComponents[2]) < 2100;
        if (validDay && validMonth && validYear) {
            return true;
        } else {
            throw new Error("Invalid Date format on SQEvent object");
        }
    }

    validSphere() {
        if(Object.keys(ValidEntries).includes(this.sphere)) {
            return true;
        } else {
            const errorMsg = `Invalid sphere: ${this.sphere}`;
            throw new Error(errorMsg);
        }
    }

    validMetric() {
        if (!ValidEntries[this.sphere].includes(this.metric)) {
            return true;
        } else {
            const errorMsg = `Invalid metric: ${this.metric}`;
            throw new Error(errorMsg);
        }
    }
 };

 module.exports = SQEvent;

