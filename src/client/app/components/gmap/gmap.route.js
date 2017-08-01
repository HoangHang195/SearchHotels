angular.module('app.gmap')
    .config(gmapConfig);

function gmapConfig($stateProvider) {
    $stateProvider
        .state('layout.gmap', {
            url: '/gmap',
            templateUrl: 'app/components/gmap/gmap.html',
            controller: 'GmapController',
            controllerAs: 'vm'
        });
}

