'use strict';

describe("Observation", function () {
    var Observation = Bahmni.Common.Obs.Observation;

    describe("display Value", function () {
        it("should return yes and no for Boolean observation", function () {
            var yesObservation = new Observation({"type": "Boolean", "value": true});
            expect(yesObservation.getDisplayValue()).toBe("Yes");
            var noObservation = new Observation({"type": "Boolean", "value": false});
            expect(noObservation.getDisplayValue()).toBe("No");
        });

        it("should return shortName if exists for coded observation", function () {
            var observation = new Observation({"type": "Coded", "value": {"shortName": "BP", "name": "Blood Pressure"}});
            expect(observation.getDisplayValue()).toBe("BP");
        });

        it("should return value for nonCoded observation", function () {
            var observation = new Observation({"type": "Numeric", "value": 1.0});
            expect(observation.getDisplayValue()).toBe(1.0);
        });

        it("should return duration if present for an observation", function () {
            var observation = new Observation({"type": "Numeric", "value": 1.0, "duration": 120});
            expect(observation.getDisplayValue()).toBe("1 since 2 Hours");
        });

        it("should return datetime in specific format", function () {
            var observation = new Observation({"type": "Datetime", "value": "December 5, 2014 05:00:00 PM IST"});
            expect(observation.getDisplayValue()).toBe("05 Dec 2014, 05:00 PM");
        });

        it("should return empty if value is null", function () {
            var observation = new Observation({"type": "Datetime", "value": ""});
            expect(observation.getDisplayValue()).toBe("");
        });
    });

    describe("is Image Concept", function(){
        it("should return concept is image", function(){
            var observation = new Observation({"type": "Text", "value": 'imageUrl1', concept: {conceptClass: 'Image'}});
            expect(observation.isImageConcept()).toBeTruthy();
        });
    });
});