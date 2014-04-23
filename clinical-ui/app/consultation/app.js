'use strict';

angular.module('consultation', ['ngRoute','opd.consultation', 'bahmni.common.patient', 'bahmni.common.util',
    'bahmni.common.visit', 'bahmni.common.encounter', 'opd.conceptSet', 'authentication', 'appFramework', 'opd.bedManagement.services',
    'httpErrorInterceptor', 'pasvaz.bindonce', 'bahmni.common.controllers', 'bahmni.common.backlink', 'opd.patientDashboard']);
angular.module('consultation').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/patient/:patientUuid/visit/:visitUuid', {
            templateUrl: 'modules/consultation/views/visit.html',
            controller: 'VisitController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid', {
            templateUrl: 'modules/patient-dashboard/views/dashboard.html',
            controller: 'PatientDashboardController',
            tiles: {header: "../common/modules/common/header.html"},
            resolve: {initialization: 'initialization', tilesLayout: 'tilesLayout'}
        });
        $routeProvider.when('/patient/:patientUuid/consultation', {
            templateUrl: 'modules/consultation/views/consultation.html',
            controller: 'ConsultationController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid/diagnosis', {
            templateUrl: 'modules/consultation/views/addObservation.html',
            controller: 'DiagnosisController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid/treatment', {
            templateUrl: 'modules/consultation/views/treatment.html',
            controller: 'TreatmentController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid/investigation', {
            templateUrl: 'modules/consultation/views/investigations.html',
            controller: 'InvestigationController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid/notes', {
            templateUrl: 'modules/consultation/views/notes.html'
        });
        $routeProvider.when('/patient/:patientUuid/templates', {
            templateUrl: 'modules/consultation/views/comingSoon.html'
        });
        $routeProvider.when('/patient/:patientUuid/disposition', {
            templateUrl: 'modules/consultation/views/disposition.html',
            controller: 'DispositionController',
            resolve: {initialization: 'initialization'}
        });
        $routeProvider.when('/patient/:patientUuid/concept-set/:conceptSetName', {
            templateUrl: 'modules/consultation/views/conceptSet.html',
            controller: 'ConceptSetPageController',
            resolve: {initialization: 'initialization'}
        });

        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
    }]).run(['backlinkService', function (backlinkService) {
        backlinkService.addUrl("Patient Q", "/clinical/patients/#/clinical");
    }]);