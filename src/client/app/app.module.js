(function () {
    'use strict';

    angular.module('app', [

        'app.layout',
        'app.dashboard',
        'app.homepage',
        'app.hotelRegister',
        'app.listhotels',
        'app.directions',
        'app.register',

        

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