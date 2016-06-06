(function() {
  'use strict';

  angular
    .module('climatic')
    .controller('FeedController', FeedController);

  function FeedController(Posts, $scope, $q, $ionicLoading, $timeout, AddPostModal) {
    var $ctrl = this;
    $ctrl.title = 'FeedController';
    $ctrl.loadNext = loadNext;
    $ctrl.refreshFeeds = refreshFeeds;
    $ctrl.showAddPostModal = showAddPostModal;

    activate();

    ////////////////

    function activate() {
      $q.resolve()
        .then($ionicLoading.show)
        .then(loadFirst)
        .finally($ionicLoading.hide);
    }

    function loadFirst() {
      var promises = [
        Posts.getPosts(),
        $timeout(500)
      ];
      return $q.all(promises)
        .then(function(response) {
          _onLoadSuccess(response[0]);
        });
    }

    function refreshFeeds() {
      // Fetch the data from the Posts factory.
      Posts.getPosts()
        .then(_onLoadSuccess)
        .then(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function loadNext() {
      Posts.getNextPosts()
        .then(_onLoadSuccess)
        .then(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    function showAddPostModal() {
      AddPostModal
        .reveal()
        .then(_onModalClosed)
        .catch(_onModalDismissed);
    }

    function _onLoadSuccess(response) {
      $ctrl.posts = response.posts;
      $ctrl.hasMorePosts = response.hasMore;
      return $q.resolve();
    }

    function _onModalClosed() {
      console.log('Modal was closed!');
      loadFirst().then($ionicLoading.hide());
    }

    function _onModalDismissed(reason) {
      console.log('Modal was dismissed! Reason: ' + reason);
    }
  }
})();
