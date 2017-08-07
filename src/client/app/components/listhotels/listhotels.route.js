angular.module('app.listhotels')
    .config(listhotelsConfig);

function listhotelsConfig($stateProvider) {
    $stateProvider
        .state('layout.listhotels', {
            url: '/listhotels',
            templateUrl: 'app/components/listhotels/listhotels.html',
            controller: 'ListHotelsController',
            controllerAs: 'vm'
        });
}