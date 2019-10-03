'use strict';

export function createAlert(message, category) {
    var alertRow = $('#js-alert-container div.row');
    var markup = '<div class="col d-flex justify-content-end bg-' + category + ' w-100 js-alert">' +
                '  <p class="text-center text-monospace text-white m-0 w-100">' + message + '</p>' +
                '    <button type="button" class="close" aria-label="Close">' +
                '      <span aria-hidden="true">&times;</span>' +
                '    </button>' +
                '</div>';

    $(markup).appendTo(alertRow).on('click', function () { this.remove(); });
}

$(document).ready(function () {
    // EVENT LISTENER TO CLOSE FLASK ALERT MESSAGES
    $('.flask-alert button.close').on('click', function () {
        var closeId = this.getAttribute('data-dismiss');
        $('#' + closeId).remove();
    });
});
