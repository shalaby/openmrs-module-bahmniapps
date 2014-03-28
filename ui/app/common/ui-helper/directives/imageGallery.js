angular.module('bahmni.common.uiHelper')
.directive('imageGallery', function(){
        var link = function($scope, element){
            $scope.element = element;

            element.bind("$destroy", function() {
                $scope.element.magnificPopup('close');
            });
        };

        var controller = function($scope, $location) {
            var galleryName = $scope.galleryName || "default-gallery";

            this.initGallery = function() {
                var options = {
                    type:'image',
                    delegate: 'img',
                    key: galleryName, 
                    gallery: {enabled: true}
                };
                $scope.element.magnificPopup(options);
            }
        };

        return {
            link: link,
            controller: controller,
            scope: {
                galleryName: '@imageGallery'
            }
        };
    })
.directive('imageGalleryItem', function() {
    var link = function($scope, element, attrs, imageGalleryCtrl){
        $(element).attr('data-mfp-src', attrs.ngSrc);
        imageGalleryCtrl.initGallery();

        element.bind("$destroy", function() {
            imageGalleryCtrl.initGallery();
        });
    };

    return {
        link: link,
        require: '^imageGallery'
    };
});