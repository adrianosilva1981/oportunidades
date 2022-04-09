var app = angular.module('opportunityAPP', ['ngRoute']);
var openSidebar = false;
var token = null

app.config(function($routeProvider, $locationProvider) {
    token = localStorage.getItem('token')

    if (token) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html',
                controller: 'homeController'
            })
            .when('/oportunidades', {
                templateUrl: 'templates/oportunidades.html',
                controller: 'oportunidadeController'
            })
            .when('/nova-oportunidade', {
                templateUrl: 'templates/nova-oportunidade.html',
                controller: 'oportunidadeController'
            })
            .when('/oportunidade/:id', {
                templateUrl: 'templates/nova-oportunidade.html',
                controller: 'oportunidadeController'
            })
            .when('/usuarios', {
                templateUrl: 'templates/usuarios.html',
                controller: 'usuarioController'
            })
            .when('/usuario/:id', {
                templateUrl: 'templates/novo-usuario.html',
                controller: 'usuarioController'
            })
            .when('/novo-usuario', {
                templateUrl: 'templates/novo-usuario.html',
                controller: 'usuarioController'
            })
            .when('/produtos', {
                templateUrl: 'templates/produtos.html',
                controller: 'produtoController'
            })
            .when('/produtos/:id', {
                templateUrl: 'templates/novo-produto.html',
                controller: 'produtoController'
            })
            .when('/novo-produto', {
                templateUrl: 'templates/novo-produto.html',
                controller: 'produtoController'
            })
            .otherwise({
                redirectTo: '/'
            });
    } else {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            }).otherwise({
                redirectTo: '/'
            });
    }

    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $location) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        if (openSidebar) {
            $("#sidebar .content").hide();
            openSidebar = false;
        }
    });
});

$('#open-side-bar').click(() => {
    openSidebar = !openSidebar;
    if (openSidebar) $("#sidebar .content").show();
    else $("#sidebar .content").hide();
});