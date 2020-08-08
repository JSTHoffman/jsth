'use strict';

$(document).ready(function() {
    $('img.gallery-image').last().on('load', function() {
        // Fade out the loading overlay
        // when the last image has loaded
        $('#loading-overlay').fadeOut(1000);
        $('#photo-gallery').fadeIn(1000);
    }).each(function() {
        // Reload the last image if was loaded from cache
        // to trigger the loading overaly fade out
        if (this.complete) {
            $(this).trigger('load');
        }
    });
});
