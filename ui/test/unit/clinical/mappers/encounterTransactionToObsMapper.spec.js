'use strict';

describe("EncounterTransactionToObsMapper", function () {
    var obsMatchingUuid = function(observations, uuid) {
        return observations.filter(function(observation) {
            return observation.uuid === uuid;
        });
    };

    it("should give a list of obs from all encounter transaction objects in an array", function () {
        var encounterTransactions = [
            {   providers: [{uuid: "provider"}],
                observations: [
                {uuid: "a61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100},
                {uuid: "b61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
            ]},
            {
                providers: [{uuid: "provider"}],
                observations: [
                {uuid: "c61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
            ]}
        ];

        var observations = new Bahmni.Clinical.EncounterTransactionToObsMapper().map(encounterTransactions);
        expect(observations.length).toBe(3);
        expect(obsMatchingUuid(observations, "a61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(1);
        expect(obsMatchingUuid(observations, "b61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(1);
        expect(obsMatchingUuid(observations, "c61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(1);
    });

    it("should ignore voided observations", function () {
        var encounterTransactions = [
            {   providers: [{uuid: "provider"}],
                observations: [
                    {uuid: "a61436b6-7813-42fd-8af2-eb5d23ed726c", voided: true, value: 100},
                    {uuid: "b61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
                ]},
            {
                providers: [{uuid: "provider"}],
                observations: [
                    {uuid: "c61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
                ]}
        ];

        var observations = new Bahmni.Clinical.EncounterTransactionToObsMapper().map(encounterTransactions);
        expect(observations.length).toBe(2);
        expect(obsMatchingUuid(observations, "a61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(0);
        expect(obsMatchingUuid(observations, "b61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(1);
        expect(obsMatchingUuid(observations, "c61436b6-7813-42fd-8af2-eb5d23ed726c").length).toBe(1);
    });

    it("should inject provider into each observation", function () {
        var encounterTransactions = [
            {   providers: [{uuid: "provider1"}],
                observations: [
                    {uuid: "a61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100},
                    {uuid: "b61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
                ]},
            {
                providers: [{uuid: "provider2"}],
                observations: [
                    {uuid: "c61436b6-7813-42fd-8af2-eb5d23ed726c", voided: false, value: 100}
                ]}
        ];

        var observations = new Bahmni.Clinical.EncounterTransactionToObsMapper().map(encounterTransactions);
        expect(observations.length).toBe(3);
        expect(obsMatchingUuid(observations, "a61436b6-7813-42fd-8af2-eb5d23ed726c")[0].provider.uuid).toBe("provider1");
        expect(obsMatchingUuid(observations, "b61436b6-7813-42fd-8af2-eb5d23ed726c")[0].provider.uuid).toBe("provider1");
        expect(obsMatchingUuid(observations, "c61436b6-7813-42fd-8af2-eb5d23ed726c")[0].provider.uuid).toBe("provider2");
    });


});
