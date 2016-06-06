(function() {
  'use strict';

  angular
    .module('climatic')
    .factory('Posts', Posts);

  function Posts($q, $window) {
    // Create our Parse Class.
    var Parse = $window.Parse;
    var Post = Parse.Object.extend('Post');

    // Set some pagination defaults.
    var page = 0;
    var pageSize = 10;

    // A local array for storing posts.
    var posts = [];

    var service = {
      getPosts: getPosts,
      getNextPosts: getNextPosts,
      getPostById: getPostById,
      savePost: savePost
    };
    return service;

    ////////////////
    function getPosts() {
      // Overwrite the posts by resetting to the
      // first page, and setting the overwrite flag.
      page = 0;
      return _fetchPosts(true);
    }

    function getNextPosts() {
      // Increment the page counter, and fetch posts.
      page++;
      return _fetchPosts();
    }

    function getPostById(id) {
      // Find a post in the posts array, by ID.
      var post = null;

      // Return the post in the posts array
      // which matches the `id` argument.
      // Each post in the posts array is an object
      // containing an `objectId` parameter. E.g.:
      // {
      //   objectId: "9ppDMcjGos",
      //   title: "Storms a-coming!",
      //   description: "The outlook is rain.",
      //   ...
      // }

      var i, len = posts.length;
      for(i = 0; i < len; i++) {
        if(posts[i].objectId === id) {
          post = posts[i];
          break;
        }
      }

      return post;
    }

    function savePost(p) {
      return $q(function(resolve, reject) {
        // Take a copy of the data so the binding isn't mucked with.
        var post = {
          username: p.username,
          title: p.title,
          description: p.description,
          picture: new Parse.File('picture.jpg', {
            base64: p.picture
          })
        };

        new Post().save(post, {
          success: function(p) {
            resolve(p.toJSON());
          },
          error: function(p, err) {
            reject(err);
          }
        });
      });
    }

    function _fetchPosts(overwrite) {
      // Return a promise from the function.
      return $q(function(resolve, reject) {
        // Create our Parse query.
        var postQuery = new Parse.Query(Post);

        // Sort newest first
        postQuery.descending('createdAt');

        // Start at the current page
        postQuery.skip(page * pageSize);

        // Limit the returned items
        postQuery.limit(pageSize);

        // Send query to Parse Server
        postQuery.find({
          success: function(results) {
            if(overwrite) {
              // Overwrite the in-memory posts.
              posts = [];
            }

            // `results` is array of Parse objects,
            // convert them to plain JSON for Angular
            angular.forEach(results, function(r) {
              posts.push(r.toJSON());
            });

            // Resolve the promise with the posts
            resolve({
              posts: posts,
              hasMore: results.length === pageSize
            });
          },
          error: function(err) {
            console.log('There was an error fetching data: ', err);

            // Reject the promise with the error
            reject(err);
          }
        });
      });
    }
  }
})();
