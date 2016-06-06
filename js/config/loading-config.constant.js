(function() {
  'use strict';

  angular
    .module('climatic')
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner></ion-spinner><p class="loading-text">Loading...</p>'
    });
})();
