'use strict';

Bahmni.Clinical.Visit = function (drugOrders, consultationNotes, otherInvestigations, observations, diagnoses, dispositions, labOrders, hasEncounters) {
    this.drugOrders = drugOrders;
    this.consultationNotes = consultationNotes;
    this.otherInvestigations = otherInvestigations;
    this.observations = observations;
    this.diagnoses = diagnoses;
    this.dispositions = dispositions;
    this.labTestOrderObsMap = labOrders;
    this.containsEncounters = hasEncounters;
}

Bahmni.Clinical.Visit.prototype = {
    hasDrugOrders: function () {
        return this.drugOrders.length > 0;
    },

    hasOtherInvestigations: function () {
        return this.otherInvestigations.length > 0;
    },

    hasObservations: function () {
        return this.observations.length > 0;
    },

    hasConsultationNotes: function () {
        return this.consultationNotes.length > 0;
    },
    hasLabTests: function () {
        return this.labTestOrderObsMap.length > 0;
    },
    hasData: function () {
        return this.hasDrugOrders() || this.hasObservations() || this.hasConsultationNotes() || this.hasLabTestOrders() || this.hasOtherInvestigations();
    },
    isConfirmedDiagnosis: function (certainity) {
        return certainity === 'CONFIRMED';
    },
    isPrimaryOrder: function (order) {
        return order === 'PRIMARY';
    },
    hasDiagnosis: function () {
        return this.diagnoses.length > 0;
    },
    hasDisposition: function () {
        return this.dispositions.length > 0;
    },
    numberOfDosageDaysForDrugOrder: function (drugOrder) {
        return Bahmni.Common.Util.DateUtil.diffInDays(new Date(drugOrder.endDate), new Date(drugOrder.startDate));
    },
    hasEncounters: function () {
        return this.containsEncounters;
    }
};

Bahmni.Clinical.Visit.create = function (encounterTransactions, consultationNoteConcept, labOrderNoteConcept, orderTypes) {
    var drugOrders, consultationNotes, otherInvestigations, observations, diagnoses = [], dispositions = [], testOrders,
        orderGroup = new Bahmni.Clinical.OrderGroup(),
        orderGroupWithObs = new Bahmni.Clinical.OrderGroupWithObs(),
        resultGrouper = new Bahmni.Clinical.ResultGrouper(),
        isLabTests = function (order) {
            var labTestOrderTypeUuid = orderTypes[Bahmni.Clinical.Constants.labOrderType];
            return order.orderTypeUuid === labTestOrderTypeUuid;
        },
        isNonLabTests = function (order) {
            return !isLabTests(order);
        },
        conceptMatches = function (observation, concepts) {
            return concepts.some(function (concept) {
                return observation.concept.uuid === concept.uuid;
            });
        },
        observationGroupingFunction = function (obs) {
            return obs.observationDateTime.substring(0, 10);
        },
        isConsultationNote = function (observation) {
            return conceptMatches(observation, [consultationNoteConcept])
        },
        isOtherObservation = function (observation) {
            return !conceptMatches(observation, [consultationNoteConcept, labOrderNoteConcept])
        },
        hasEncounters = encounterTransactions.length > 0;


    drugOrders = orderGroup.create(encounterTransactions, 'drugOrders');
    otherInvestigations = orderGroup.create(encounterTransactions, 'testOrders', isNonLabTests);
    testOrders = orderGroupWithObs.create(encounterTransactions, 'testOrders', isLabTests);

    var allObs = new Bahmni.Clinical.EncounterTransactionToObsMapper().map(encounterTransactions);
    consultationNotes = resultGrouper.group(allObs.filter(isConsultationNote), observationGroupingFunction, 'obs', 'date');
    observations = resultGrouper.group(allObs.filter(isOtherObservation), observationGroupingFunction, 'obs', 'date');

    angular.forEach(encounterTransactions, function (encounterTransaction) {
        angular.forEach(encounterTransaction.diagnoses, function (diagnosis) {
            diagnosis.provider = encounterTransaction.providers[0];
            diagnoses.push(diagnosis);
        });

        if (encounterTransaction.disposition) {
            encounterTransaction.disposition.provider = encounterTransaction.providers[0];
            dispositions.push(encounterTransaction.disposition);
        }
    });

    return new this(drugOrders, consultationNotes, otherInvestigations, observations, diagnoses, dispositions, testOrders, hasEncounters);
}