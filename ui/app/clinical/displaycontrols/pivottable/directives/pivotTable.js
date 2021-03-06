'use strict';
angular.module('bahmni.clinical').directive('pivotTable', ['$filter','spinner','pivotTableService',
    function ($filter,spinner,pivotTableService) {

        return {
            scope: {
                patientUuid: "=",
                diseaseName: "=",
                displayName: "=",
                config: "=",
                visitUuid:"="
            },
            link: function (scope) {

                if(!scope.config) return;

                scope.groupBy = scope.config.groupBy || "visits";
                scope.groupByEncounters = scope.groupBy === "encounters";
                
                scope.getOnlyDate = function(startdate) {
                    return moment(startdate).format("DD MMM YY");
                };

                scope.getOnlyTime = function(startDate) {
                    return moment(startDate).format("hh:mm A");
                };

                scope.isLonger = function(value){
                   return value ? value.length > 13 : false;
                };

                scope.getColumnValue = function(value){
                    return scope.isLonger(value) ? value.substring(0,10)+"..." : value;
                };

                var pivotDataPromise = pivotTableService.getPivotTableFor(scope.patientUuid,scope.config, scope.visitUuid );
                spinner.forPromise(pivotDataPromise);
                pivotDataPromise.success(function (data) {
                    scope.result = data;
                    scope.hasData = !_.isEmpty(scope.result.tabularData);
                })
            },
            templateUrl: 'displaycontrols/pivottable/views/pivotTable.html'
        }
}]);