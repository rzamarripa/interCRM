angular.module("casserole").run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    switch(error) {
      case "AUTH_REQUIRED":
        $state.go('anon.login');
        break;
      case "FORBIDDEN":
        //$state.go('root.home');
        break;
      case "UNAUTHORIZED":
      	toastr.error("Acceso Denegado");
				toastr.error("No tiene permiso para ver esta opción");
        break;
      default:
        $state.go('internal-client-error');
    }
/*
    if (error === 'AUTH_REQUIRED') {
      $state.go('anon.login');
    }
*/
  });
});

angular.module('casserole').config(['$injector', function ($injector) {
  var $stateProvider = $injector.get('$stateProvider');
  var $urlRouterProvider = $injector.get('$urlRouterProvider');
  var $locationProvider = $injector.get('$locationProvider');

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  /***************************
   * Anonymous Routes
   ***************************/
  $stateProvider
    .state('anon', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })
    .state('anon.login', {
      url: '/login',
      templateUrl: 'client/login/login.ng.html',
      controller: 'LoginCtrl',
      controllerAs: 'lc'
    })    
    .state('anon.nuevoProspectoFacebook', {
      url: '/nuevoProspectoFacebook',
      templateUrl: 'client/facebook/nuevoProspectoFacebook.ng.html',
      controller: 'ProspectosFacebookCtrl as fa',
    })        
    .state('anon.graciasFacebook', {
      url: '/graciasFacebook',
      templateUrl: 'client/facebook/graciasFacebook.ng.html',
      controller: 'GraciasFacebookCtrl as fa',
    })
    .state('anon.logout', {
      url: '/logout',
      resolve: {
        'logout': ['$meteor', '$state', 'toastr', function ($meteor, $state, toastr) {
          return $meteor.logout().then(
            function () {
	            toastr.success("Vuelva pronto.");
              $state.go('anon.login');
            },
            function (error) {
              toastr.error(error.reason);
            }
          );
        }]
      }
    });

  /***************************
   * Login Users Routes
   ***************************/
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'client/layouts/root.ng.html',
      controller: 'RootCtrl',
    })
    .state('root.home', {
      url: '/',
      templateUrl: 'client/home/home.ng.html',      
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.prospectosFacebook', {
      url: '/prospectosFacebook',
      templateUrl: 'client/facebook/prospectosFacebook.ng.html',
      controller: 'ProspectosFacebookCtrl as fa',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })    
    .state('root.prospectoFacebook', {
      url: '/prospectoFacebook/:id',
      templateUrl: 'client/facebook/prospectoFacebook.ng.html',
      controller: 'ProspectoFacebookCtrl as fa',
    })
    .state('root.noticias', {
      url: '/noticias',
      templateUrl: 'client/noticias/noticias.ng.html',
      controller: 'NoticiasCtrl as no',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })    
    .state('root.empleados', {
      url: '/empleados',
      templateUrl: 'client/empleados/empleados.ng.html',
      controller: 'EmpleadosCtrl as emp',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })
    .state('root.etapasVenta', {
      url: '/etapasVenta',
      templateUrl: 'client/etapasVenta/etapasVenta.ng.html',
      controller: 'EtapasVentaCtrl as ev',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })
    .state('root.prospectosFacebookStaff', {
      url: '/prospectosFacebookStaff',
      templateUrl: 'client/facebook/prospectosFacebookStaff.ng.html',
      controller: 'ProspectosFacebookStaffCtrl as fa',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Staff"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    })
    .state('root.prospectosSeguimiento', {
      url: '/prospectosSeguimiento',
      templateUrl: 'client/facebook/prospectosSeguimiento.ng.html',
      controller: 'ProspectosSeguimientoCtrl as fa',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    }) 
    .state('root.usuarios', {
      url: '/usuarios',
      templateUrl: 'client/usuarios/usuarios.ng.html',
      controller: 'UsuariosCtrl as user',
      resolve: {
				"currentUser": ["$meteor", "toastr", function($meteor, toastr){
					return $meteor.requireValidUser(function(user) {
						if(user.roles[0] == "Admin" || user.roles[0] == "administrador"){
							return true;
						}else{
							return 'UNAUTHORIZED'; 
						}					 	
         });
       }]
    	}
    }) 
}]);
 