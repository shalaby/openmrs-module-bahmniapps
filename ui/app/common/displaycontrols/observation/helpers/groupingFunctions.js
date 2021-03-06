Bahmni.Common.DisplayControl.GroupingFunctions = function(){

    var self = this;
    var observationGroupingFunction = function (obs) {
        return Bahmni.Common.Util.DateUtil.getDateTimeWithoutSeconds(obs.encounterDateTime);
    };

    self.groupByEncounterDate = function (bahmniObservations) {
        var obsArray = [];
        bahmniObservations = _.groupBy(bahmniObservations, observationGroupingFunction);

        var sortWithInAConceptDateCombination = function(anObs, challengerObs) {
            if (anObs.encounterDateTime < challengerObs.encounterDateTime) {
                return 1;
            }
            if (anObs.encounterDateTime > challengerObs.encounterDateTime) {
                return -1;
            }
            if (anObs.sortWeight < challengerObs.sortWeight) {
                return -1;
            }
            if (anObs.sortWeight > challengerObs.sortWeight) {
                return 1;
            }

            return 0;
        };

        for (var obsKey in bahmniObservations){
            var dateTime = obsKey;

//            console.log(JSON.stringify(bahmniObservations[dateTime]));
            var anObs = {
                "key" : dateTime,
                "value" : bahmniObservations[dateTime].sort(sortWithInAConceptDateCombination),
                "date" : dateTime
            };

            obsArray.push(anObs);
        }
        return _.sortBy(obsArray, ['date']).reverse();
    };

    return self;
};