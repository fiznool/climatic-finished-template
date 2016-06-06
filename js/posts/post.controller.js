(function() {
  'use strict';

  angular
    .module('climatic')
    .controller('PostController', PostController);

  function PostController($stateParams, Posts) {
    var $ctrl = this;
    $ctrl.title = 'PostController';

    activate();

    ////////////////

    function activate() {
      $ctrl.post = Posts.getPostById($stateParams.id);
    }
  }
})();
