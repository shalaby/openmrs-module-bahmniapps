'use strict';

describe('VisitController', function () {
    var scope;
    var $controller;
    var success;
    var encounterService;
    var patientService;
    var patient;
    var dateUtil;
    var $timeout;
    var spinner;
    var getEncounterPromise;
    var getPatientPromise;
    var stateParams;
    var patientMapper;
    var q;
    var state;
    var appService;
    var appDescriptor;
    var sessionService;
    var messagingService;
    var stubAllPromise = function () {
        return {
            then: function () {
                return stubAllPromise();
            }
        }
    };
    var stubOnePromise = function () {
        return {
            then: function (callBack) {
                return callBack();
            }
        }
    };

    var sampleConfig = {
        "conceptData": {
            "WEIGHT": {
                "uuid": "b4aa3728-c79a-11e2-b0c0-8e397087571c"
            },
            "BMI": {
                "uuid": "b4acc09c-c79a-11e2-b0c0-8e397087571c"
            },
            "HEIGHT": {
                "uuid": "b4a7aa80-c79a-11e2-b0c0-8e397087571c"
            }
        },
        "encounterTypes": {
            "REG": "b45de99a-c79a-11e2-b0c0-8e397087571c"
        },
        "visitTypes": {
            "REG": "b45ca846-c79a-11e2-b0c0-8e397087571c",
            "REVISIT": "b5ba5576-c79a-11e2-b0c0-8e397087571c"
        }

    };
    var sampleEncounter = {
        "observations": []
    };

    beforeEach(module('bahmni.registration'));
    beforeEach(module('stateMock'));
    beforeEach(inject(['$injector', '$timeout', '$q', '$rootScope', '$state', function ($injector, timeout, $q, $rootScope, $state) {
        q = $q;
        messagingService = jasmine.createSpyObj('messagingService', ['showMessage']);
        stateParams = {patientUuid: '21308498-2502-4495-b604-7b704a55522d'};
        patient = {
            uuid: "21308498-2502-4495-b604-7b704a55522d",
            isNew: "true",
            person: {
                names: [
                    "name"
                ]
            }
        };
        state = $state;
        $controller = $injector.get('$controller');
        scope = {"$watch": jasmine.createSpy()};
        patientService = jasmine.createSpyObj('patientService', ['get']);
        appService = jasmine.createSpyObj('appService', ['getDescription', 'getAppDescriptor']);
        appDescriptor = jasmine.createSpyObj('appDescriptor', ['getConfigValue', 'getExtensions']);
        appService.getAppDescriptor.and.returnValue(appDescriptor);
        appDescriptor.getExtensions.and.returnValue([]);
        patientMapper = jasmine.createSpyObj('patientMapper', ['map']);
        dateUtil = Bahmni.Common.Util.DateUtil;
        $timeout = timeout;
        success = jasmine.createSpy();
        $rootScope.regEncounterConfiguration = new Bahmni.Registration.RegistrationEncounterConfig({visitTypes: {}}, {encounterTypes: {"REG": "someUUID"}});
        scope.regEncounterConfiguration = angular.extend(new Bahmni.Registration.RegistrationEncounterConfig(), sampleConfig);
        scope.encounterConfig = angular.extend(new EncounterConfig(), sampleConfig);
        spinner = jasmine.createSpyObj('spinner', ['forPromise']);
        spinner.forPromise.and.callFake(function () {
            return;
        });
        sessionService = jasmine.createSpyObj('sessionService', ['getLoginLocationUuid']);
        encounterService = jasmine.createSpyObj('encounterService', ['create', 'activeEncounter']);
        getEncounterPromise = specUtil.createServicePromise('activeEncounter');
        getPatientPromise = specUtil.createServicePromise('get');
        encounterService.activeEncounter.and.returnValue(getEncounterPromise);
        patientService.get.and.returnValue(getPatientPromise);
        scope.currentProvider = {uuid: ''};
        patientMapper.map.and.returnValue(patient);

    }]));

    describe('initialization', function () {
        it('should set the patient from patient data', function () {
            $controller('VisitController', {
                $scope: scope,
                spinner: spinner,
                encounterService: encounterService,
                patientService: patientService,
                $stateParams: stateParams,
                openmrsPatientMapper: patientMapper,
                appService: appService,
                sessionService: sessionService
            });

            getPatientPromise.callSuccessCallBack(patient);
            getEncounterPromise.callSuccessCallBack(sampleEncounter);

            expect(scope.patient).toBe(patient);
        });
    });


    describe("submit", function () {

        beforeEach(function () {
            $controller('VisitController', {
                $scope: scope,
                $q: Q,
                encounterService: encounterService,
                patientService: patientService,
                spinner: spinner,
                $state: state,
                $stateParams: stateParams,
                appService: appService,
                openmrsPatientMapper: patientMapper,
                sessionService: sessionService,
                messagingService: messagingService
            });
            getPatientPromise.callSuccessCallBack(patient);
            getEncounterPromise.callSuccessCallBack(sampleEncounter);

            encounterService.create.and.callFake(stubOnePromise);
            scope.patient = {uuid: "21308498-2502-4495-b604-7b704a55522d"};
        });

        it("should validate save and reload current page", function (done) {
            state.expectTransitionTo(state.current);
            var submit = scope.submit();
            submit.then(function (response) {
                expect(encounterService.create).toHaveBeenCalled();
                expect(messagingService.showMessage).toHaveBeenCalledWith('info', 'Saved');
                state.ensureAllTransitionsHappened();
                done();
            });
        });
    });
});