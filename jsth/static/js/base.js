'use strict';

// EVENT LISTENER TO CLOSE FLASK ALERT MESSAGES
$('.flask-alert button.close').on('click', function () {
    var closeId = this.getAttribute('data-dismiss');
    $('#' + closeId).remove();
});