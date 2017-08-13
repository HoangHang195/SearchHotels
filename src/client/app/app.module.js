(function () {
    'use strict';

    angular.module('app', [

        'app.layout',
        'app.homepage',
        'app.hotelRegister',
        'app.listhotels',
        'app.directions',
        'app.register',
        'app.auth',
        'app.signin',
        'app.signup',

        

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