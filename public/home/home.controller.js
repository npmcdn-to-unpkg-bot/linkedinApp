(function () {
    'use strict';


    function crtl($scope) {}
    angular
    .module('app')
    .controller('HomeController', HomeController);

    
    angular
    .module('app').factory('sse', function($rootScope) {
      // $scope.number = 0;
      var sse = new EventSource('/stream');
      return {
        a: 1,
        addEventListener: function(eventName, callback) {
          sse.addEventListener(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(sse, args);
          });
        });
      }
  };
});
    angular
    .module('app')
    .directive('testEduc', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                text: '@'
            },
            template: '<button ng-click="addEduc();Y=true" ng-hide = "Y">{{text}}</button>',
            controller: function ($scope, $element) {
                $scope.addEduc = function () {

                    var el = $compile("<div>Ecole : <input type = 'number' id ='Language'> From  <input type = 'number' id ='EducDateBegin'> to <input type = 'text' id ='EducDateEnd'><testEduc text='+'></testEduc></div>")($scope);
                    $element.parent().append(el);
                };
            }
        };
    })
    .directive('test', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                text: '@'
            },
            template: '<button ng-click="addLang();X=true" ng-hide = "X" >{{text}}</button>',
            controller: function ($scope, $element) {
                $scope.addLang = function () {

                    var el = $compile("<div>Language : <input type = 'text' id ='Language'></input><test text='+'></test></div>")($scope);
                    $element.parent().append(el);
                };
            }
        };
    });

    HomeController.$inject = ['UserService', '$rootScope','$scope','$http', '$interval', '$compile','sse'];
    function crtl($scope) {}
    function HomeController(UserService, $rootScope ,$scope,$http,$compile, $interval, sse) {
        $scope.searchprofile = {
            email:'',
            identifier: ''
            
            
        };








        $scope.education = {
            educ: [{
                name: 'Enit',
                begin: '',
                end: ''}]                
            };
            $scope.language = {
                lang:[{
                name : 'arabic'
            }]
            };
            $scope.skill = {
                sk : [{
                    name : '',
                    number : 0
                }]
            };
            $scope.experience = {
                exp : [{
                    position : '',
                    company : 0
                }]
            };
            $scope.addItem = function() {
                $scope.education.educ.push({
                    name: '',
                    begin: '',
                    end: ''
                });
            },
            $scope.addItem2 = function() {
                $scope.language.lang.push({
                    name: ''
                });
            },
            $scope.addItem3 = function() {
                $scope.skill.sk.push({
                    name: '',
                    number : 0
                });
            },
             $scope.addItem4 = function() {
                $scope.experience.exp.push({
                    name: ''
                });
            },

            $scope.removeItem = function(index) {
                $scope.education.educ.splice(index, 1);
            }
            $scope.removeItem2 = function(index) {
                $scope.language.lang.splice(index, 1);
            },
            $scope.removeItem3 = function(index) {
                $scope.skill.sk.splice(index, 1);
            }
             $scope.removeItem4 = function(index) {
                $scope.experience.exp.splice(index, 1);
            }

$scope.searchprofile = function (){
    if($scope.searchprofile.email ==null){$scope.searchprofile.email=''};
    if($scope.searchprofile.identifier ==null){$scope.searchprofile.identifier=''};
    var profile = {
        email : $scope.searchprofile.email,
        identifier : $scope.searchprofile.identifier,
        education :$scope.education,
        language :$scope.language,
        skill : $scope.skill,
        experience : $scope.experience
    };
    console.log(profile);
      var posting = $http({
                    method: 'POST',
                    url: '/postSearch',
                    data: profile,

                    processData: false
                })
                posting.success(function (response) {
                    $scope.searchResponse = response;
                    console.log(response);
                    

                });
    
}
            $scope.testNumber = 0;
            var vm = this;
            $scope.a=sse.a;
            vm.user = null;
            vm.allUsers = [];
            vm.deleteUser = deleteUser;
            $scope.counta = 0;
            $scope.counto = 0;
            $scope.count = 10;
            var evo = new EventSource('/time');
            evo.addEventListener('time', function (result) {
                $scope.serverdata2= result.data;
            })
            $scope.data = {};
            initController();
            $scope.send2 = function () {
                var resp2 = {
                    linkedInAccount : vm.user.linkedInAccount,
                    linkedInpassword : vm.user.linkedInpassword,
                    filter : $scope.data.singleSelect

                };
                var posting = $http({
                    method: 'POST',
                    url: '/post2',
                    data: resp2,

                    processData: false
                })
                posting.success(function (response) {
                    console.log(response);

                });
            }
            $scope.send = function () {

             console.log("inside click");
             var resp = {
                linkedInAccount : vm.user.linkedInAccount,
                linkedInpassword : vm.user.linkedInpassword
            }
            $scope.count = $scope.count + 1

            var posting = $http({
                method: 'POST',
                url: '/post',
                data: vm.user,

                processData: false
            })
            posting.success(function (response) {
                console.log(response);

            });
        };
        
        $scope.myFunction2 = function() {

            $scope.send2();
            $scope.numbaro = 0;
            var x = Math.floor((Math.random() * 10) + 1);
            $interval(function(){ x = Math.floor((Math.random() * 10) + 1); $scope.numbaro= $scope.numbaro+1; }, 1000*x);
        };
        $scope.myFunction = function() {

            $scope.send();
            var ev = new EventSource('/time');
            ev.addEventListener('time', function (result) {
                $scope.serverdata= result.data;
            })
        };

        $http({
          method: 'GET',
          url: '/someUrl'
      }).then(function successCallback(response) {
        $scope.response = response;
    }, function errorCallback(response) {

    });



      function initController() {
        loadCurrentUser();
        loadAllUsers();
    }

    function loadCurrentUser() {
        UserService.GetByUsername($rootScope.globals.currentUser.username)
        .then(function (user) {
            vm.user = user;
        });
    }

    function loadAllUsers() {
        UserService.GetAll()
        .then(function (users) {
            vm.allUsers = users;
        });
    }

    function deleteUser(id) {
        UserService.Delete(id)
        .then(function () {
            loadAllUsers();
        });
    }
}

})();



