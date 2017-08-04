angular.module('app.homepage')
    .config(homepageConfig);

function homepageConfig($stateProvider) {
    $stateProvider
        .state('homepage', {
            url: '/homepage',
            templateUrl: 'app/components/homepage/homepage.html',
            controller: 'HomePageController',
            controllerAs: 'vm'
        });
}