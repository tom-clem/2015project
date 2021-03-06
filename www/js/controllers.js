angular.module('starter.controllers', []);

example.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});



  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


});

example.controller('ChoresCtrl', function($scope, Items, $ionicListDelegate, $state) {



});

example.controller('FirebaseCtrl', function($scope, Items, $ionicListDelegate, $state) {
  $scope.items = Items;
  $scope.checked = $scope.items.checked;
  var ref = new Firebase("https://dazzling-torch-81.firebaseio.com");
  ref.onAuth(function(authData) {
    if (authData) {
      console.log("Authenticated with uid:", authData.uid);
      $scope.user = authData.uid;
    } else {
    $state.go('app.login');
    }
  });

  $scope.addItem = function() {
    var name = prompt('What do you need to buy?');
    if (name) {
      $scope.items.$add({
        'name': name,
        'checked': false
      });
    }
  };

  $scope.checkItem = function(item) {
    var itemRef = new Firebase('https://dazzling-torch-81.firebaseio.com/'+$scope.user+'/todos/' + item.$id);
    $scope.checked = !$scope.checked;
    console.log($scope.checked);


    if ($scope.checked) {
      itemRef.child('checked').set('true');
      $ionicListDelegate.closeOptionButtons();
    } else {
      itemRef.child('checked').set('false');
      $ionicListDelegate.closeOptionButtons();

    }

  };
  $scope.deleteTodo = function(item){
    var deleteTodo = new Firebase('https://dazzling-torch-81.firebaseio.com/'+$scope.user+'/todos/' + item.$id);
    deleteTodo.remove();

  };
});


example.controller('SignUpCtrl', function($scope, $state) {


$scope.signup = function(useremail, password){
  var ref = new Firebase("https://dazzling-torch-81.firebaseio.com");
  ref.createUser({
    email    : useremail,
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData);
      console.log(onAuth()+"Here ist the on Auth");
      $state.go('app.login');
    }
  });
};
});


example.controller('LoginCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth) {
  $scope.login = function(email, password) {
    auth.login(email, password).then(function() {
      $state.go('app.home');
    });
  };
}]);


example.controller("ExampleController", function($scope, $ionicPopup, PouchDBListener) {

    $scope.todos = [];

    $scope.result = [];


    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'Enter a new TODO item',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== "") {
                if($scope.hasOwnProperty("todos") !== true) {
                    $scope.todos = [];
                }
                localDB.post({_id: result});
            } else {
                console.log("Action not completed");
            }
        });
    };

    $scope.addtodo = function(text) {
            if(text !== "") {
                if($scope.hasOwnProperty("todos") !== true) {
                    $scope.todos = [];
                }
                localDB.post({
                  _id: text,
                  completed: false});
            } else {
                console.log("Action not completed");
            }
        };

        $scope.deleteTodo = function(todo){
          localDB.remove(todo);
        };

    $scope.get = function(query){
      remoteDB.get(query).then(function (result) {
        $scope.result = result;
      });
    };

    $scope.toggleCompleted = function(todo){
    todo.completed = !todo.completed;

  };

    $scope.$on('add', function(event, todo) {
        $scope.todos.push(todo);

    });

    $scope.$on('delete', function(event, id) {
        for(var i = 0; i < $scope.todos.length; i++) {
            if($scope.todos[i]._id === id) {
                $scope.todos.splice(i, 1);
            }
        }
    });

});
