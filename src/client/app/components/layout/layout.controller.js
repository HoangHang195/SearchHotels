angular.module('app.layout')
    .controller('layoutController', ['$state', layoutController]);

function layoutController($state) {
    var vm = this;
    vm.namePage = '';
    // vm.logout = logout;

    // function logout() {
    //     toastr.success(authService.logout());
    //     $state.go('auth.login');
    // }
}