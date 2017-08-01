angular.module('app.layout')
    .config(layoutConfig);

function layoutConfig($stateProvider) {
    $stateProvider
        .state('layout', {
            url: '',
            templateUrl: 'app/components/layout/layout.html',
            controller: 'layoutController',
            controllerAs: 'vm'
        });
}