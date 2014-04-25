'use strict';

angular.module('bahmni.clinical').controller('ConsultationNavigationController',
    ['$scope', '$rootScope', '$location', '$window', 'appService', 'urlHelper', 'contextChangeHandler',
        function ($scope, $rootScope, $location, $window, appService, urlHelper, contextChangeHandler) {
            //$scope.mainButtonText = "Consultation";
            
            var boardTypes = {
                visit: 'visit',
                consultation: 'consultation'
            };
            $scope.availableBoards = [
                { name: 'Visit', url: '', type: boardTypes.visit},
                { name: 'Consultation', url: 'consultation', type: boardTypes.consultation }
            ];
            $scope.currentBoard = $scope.availableBoards[0];
            $scope.showBoard = function (name) {
                var board = findBoardByname(name);
                return buttonClickAction(board);
            };

            $scope.gotoPatientDashboard = function() {
                $location.path("/patient/" + $rootScope.patient.uuid + "/dashboard");
            }

            var setCurrentBoardBasedOnPath = function() {
                var currentPath = $location.path();
                var board = findBoardByUrl(currentPath);
                $scope.currentBoard = board || $scope.availableBoards[0];
            };

            var stringContains = function (sourceString, pattern) {
                return (sourceString.search(pattern) >= 0);
            };

            var initialize = function () {
                $rootScope.$on('event:appExtensions-loaded', function () {
                    var appExtensions = appService.getAppDescriptor().getExtensions("org.bahmni.clinical.consultation.board", "link");
                    var addlBoards = [];
                    appExtensions.forEach(function (appExtn) {
                        addlBoards.push({ name: appExtn.label, url: appExtn.url, type: boardTypes.consultation });
                    });
                    $scope.availableBoards = $scope.availableBoards.concat(addlBoards);
                    setCurrentBoardBasedOnPath();
                });
            };

            $scope.$on('$stateChangeStart', function() { 
                setCurrentBoardBasedOnPath();
            });

            var findBoardByname = function (name) {
                var boards = $scope.availableBoards.filter(function (board) {
                    return board.name === name;
                });
                return boards.length > 0 ? boards[0] : null;
            };

            var findBoardByUrl = function (url) {
                var boards = $scope.availableBoards.filter(function (board) {
                    return stringContains(url, board.url);
                });
                return boards.length > 0 ? boards[1] : null;
            };

            var getUrl = function (board) {
                var urlPrefix = board.type === boardTypes.visit ? urlHelper.getVisitUrl($rootScope.consultation.visitUuid) : urlHelper.getPatientUrl();
                var url = board.url ? urlPrefix + "/" + board.url : urlPrefix ; 
                return $location.url(url);                    
            };


            var buttonClickAction = function (board) {
                if ($scope.currentBoard === board) return;
                if (!contextChangeHandler.execute()) return;
                contextChangeHandler.reset();
                $scope.currentBoard = board;
                return getUrl(board);
            };

            initialize();

        }]);