angular.module('app.dashboard')
    .config(dashboardConfig);

function dashboardConfig($stateProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/components/dashboard/dashboard.html',
            controller: 'dashboardController',
            controllerAs: 'vm'
        });
}