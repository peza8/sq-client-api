/**
 * Model class for a Self Quants event type
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 01/11/2020
 */

const UUID = require('uuid-v4');

 class SQEvent {
    constructor(_date, _sphere, _metric, _data_01, _data_02) {
        this.uid = UUID();
        this.date = _date;
        this.sphere = _sphere;
        this.metric = _metric;
        this.data_01 = _data_01;
        this.data_02 = _data_02;
        this.entered = new Date();
    }

    getEventJSON() {
        return {
            uid:     this.uid,
            date:    this.date,
            sphere:  this.sphere,
            metric:  this.metric,
            data_01: this.data_01,
            data_02: this.data_02,
            entered: this.entered
        }
    }
 };

 module.exports = SQEvent;

