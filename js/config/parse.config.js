(function() {
  'use strict';

  angular
    .module('climatic')
    .config(config);

  function config($windowProvider) {
    // Initialise Parse
    var Parse = $windowProvider.$get().Parse;
    Parse.initialize('climatic');
    Parse.serverURL = 'https://climatic.herokuapp.com/api';
  }
})();
