'use strict';

export function createAlert(message, category) {
    var alertRow = $('#js-alert-container div.row');
    var alertElement = $(
        '<div class="col d-flex justify-content-end bg-' + category + ' w-100 js-alert">' +
        '  <p class="text-center text-monospace text-white m-0 w-100">' + message + '</p>' +
        '  <button type="button" class="close" aria-label="Close">' +
        '    <span aria-hidden="true">&times;</span>' +
        '  </button>' +
        '</div>'
    );

    alertElement.appendTo(alertRow).on('click touch', function () {
        this.remove();
    });
}

$(document).ready(function () {
    // EVENT LISTENER TO CLOSE THE NAV
    // MENU ON CLICKS OUTSIDE THE NAV
    $(document).on('click touch', function (event) {
        var target = $(event.target);
        if (target.parents('.navbar-collapse').length < 1) {
            var navbar = $('.navbar-collapse');
            var navMenuOpen = navbar.hasClass('show');
            if (navMenuOpen === true && !target.hasClass('navbar-toggle')) {
                navbar.collapse('hide');
            }
        }
    });

    // EVENT LISTENER TO CLOSE FLASK ALERT MESSAGES
    $('.flask-alert button.close').on('click touch', function () {
        var closeId = this.getAttribute('data-dismiss');
        $('#' + closeId).remove();
    });
});
