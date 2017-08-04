(function () {
    'use strict';

    angular.module('app', [

        'app.layout',
        'app.dashboard',
        'app.homepage',
        'app.gmap',
        'app.listhotels',

        

        'ui.router',
        // 'angular-jwt',
        // 'ngStorage',
        'ngAnimate',
        'ngSanitize',
        'ngplus',
        // 'app.auth',
        'blocks.exception',
        'blocks.logger',
        'blocks.router',
        'infinite-scroll',
        // 'ngLess'
        // 'ngInfiniteScroll',
    ]);

})();