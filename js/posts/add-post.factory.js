(function() {
  'use strict';

  angular
    .module('climatic')
    .factory('AddPostModal', AddPostModal);

  function AddPostModal(
    Posts,
    $q,
    $rootScope,
    $window,
    $ionicModal,
    $ionicPlatform,
    $ionicPopup,
    $ionicLoading,
    $cordovaCamera) {

    var service = {
      reveal: reveal
    };
    return service;

    ////////////////

    function reveal() {
      var scope = $rootScope.$new();
      scope.$ctrl = {};
      var config = {
        scope: scope,
        animation: 'slide-in-up',
        focusFirstInput: false,
        backdropClickToClose: false,
        hardwareBackButtonClose: true
      };

      return $ionicModal
        .fromTemplateUrl('tmpl/posts/add-post-modal.html', config)
        .then(_activate);
    }

    function _activate(modal) {
      return $q(function(resolve, reject) {
        var $ctrl = modal.scope.$ctrl;

        var username = _getUsername() || null;
        if(username) {
          $ctrl.hasUsername = true;
        }

        // Setup the modal formData.
        $ctrl.formData = {
          username: username,
          title: null,
          description: null,
          picture: null
        };

        // Set up the modal scope functions.
        $ctrl.save = save;
        $ctrl.cancel = cancel;
        $ctrl.addPicture = addPicture;

        // Show the modal.
        modal.show();

        function save() {
          $ctrl.form.$setSubmitted();

          if($ctrl.form.$valid) {
            if(!$ctrl.hasUsername) {
              _setUsername($ctrl.formData.username);
            }

            $q.resolve()
              .then($ionicLoading.show)
              .then(function() {
                return Posts.savePost($ctrl.formData);
              })
              .then(function() {
                _close().then(resolve);
              }, function() {
                $ionicLoading.hide().then(_onSaveError);
              });
          }
        }

        function cancel() {
          _close().then(function() {
            reject('cancelled');
          });
        }

        function _getUsername() {
          return $window.localStorage.getItem('username');
        }

        function _setUsername(username) {
          $window.localStorage.setItem('username', username);
        }

        function _close() {
          return modal.remove();
        }

        function addPicture() {
          $ionicPlatform.ready(function() {
            var Camera = $window.Camera;
            if(!Camera) {
              return _onCameraError({ msg: 'No Camera object!'});
            }
            var options = {
              quality: 80,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 960,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };

            $cordovaCamera
              .getPicture(options)
              .then(function(imageData) {
                $ctrl.formData.picture = imageData;

              }, function(err) {
                if(err === 'Camera cancelled.') {
                  // The user closed the camera.
                  return;
                }

                // Otherwise, there was a genuine error!
                _onCameraError(err);
              });
          });
        }

        function _onCameraError(err) {
          console.log('Error getting picture:');
          console.dir(err);

          $ionicPopup.alert({
            title: 'Error',
            template: 'There was an error when taking your picture. Please try again.'
          });
        }

        function _onSaveError(err) {
          console.log('Error saving post:');
          console.dir(err);

          $ionicPopup.alert({
            title: 'Error',
            template: 'There was an error when saving your post. Please try again.'
          });
        }
      });
    }
  }
})();
