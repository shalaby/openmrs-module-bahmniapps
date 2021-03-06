'use strict';

describe("PatientDashboardLabOrdersController", function () {

    beforeEach(module('bahmni.clinical'));

    var scope;
    var stateParams;
    var _dashboardConfig;
    var spinner = jasmine.createSpyObj('spinner', ['forPromise']);
    var labResultSection = {
        "title": "Lab Results",
        "name": "labOrders",
        "dashboardParams": {
            "title": null,
            "showChart": false,
            "showTable": true,
            "showNormalValues": true,
            "showCommentsExpanded": true,
            "showAccessionNotes": true
        }
    };
    var controller;

    beforeEach(inject(function ($controller, $rootScope) {
        controller = $controller;
        scope = $rootScope.$new();

        spinner.forPromise.and.callFake(function(param) {return {}});
        _dashboardConfig = jasmine.createSpyObj('dashboardConfig', ['getSectionByName']);
        _dashboardConfig.getSectionByName.and.returnValue(labResultSection);
        
        scope.dashboardConfig = _dashboardConfig;
        stateParams = {
            patientUuid: "some uuid"
        };
    }));

    describe("when initialized", function () {
        it("creates configuration for displaying lab order display parameters", function () {
        controller('PatientDashboardLabOrdersController', {
            $scope: scope,
            $stateParams: stateParams,
            spinner: spinner
        });


            var params = scope.dashboardParams;
            expect(params.patientUuid).toBe("some uuid");
            expect(params.showNormalValues).toBe(labResultSection.dashboardParams.showNormalValues);
        });

        it("passes in just the patient uuid when no parameters specified", function () {
            scope.dashboardConfig.getSectionByName.and.returnValue({});
            controller('PatientDashboardLabOrdersController', {
                $scope: scope,
                $stateParams: stateParams
            });

            var params = scope.dashboardParams;
            expect(params.patientUuid).toBe("some uuid");
        });

    });
});