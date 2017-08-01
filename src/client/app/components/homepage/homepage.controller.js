/*jshint esversion: 6*/

(function () {
    angular.module('app.homepage')
        .controller('HomePageController', ['$q', '$http', '$state', HomepageController]);

    function HomepageController($q, $http, $state) {
        var currentPage = 1;
        var pageSize = 6;
        var vm = this;
        vm.sw = 1;
        vm.backgrounColor = ['#504F4F', '#484747', '#414040', '#3C3A3A', '#373636'];
        vm.currentTeam = 0;
        vm.teams = [];
        vm.isBusy = false;
    }
        
})();