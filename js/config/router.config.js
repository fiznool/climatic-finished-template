(function() {
  'use strict';

  angular
    .module('climatic')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('feed', {
        url: '/posts',
        templateUrl: 'tmpl/posts/feed.html',
        controller: 'FeedController',
        controllerAs: '$ctrl'
      })
      .state('post', {
        url: '/posts/:id',
        templateUrl: 'tmpl/posts/post.html',
        controller: 'PostController',
        controllerAs: '$ctrl'
      });

    $urlRouterProvider.otherwise('posts');
  }
})();
