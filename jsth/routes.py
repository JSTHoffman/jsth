'''
All "frontend" routes.
'''


from flask import (
    make_response,
    redirect,
    render_template,
    request
)

from jsth import (
    utils
)


def register_routes(app):
    '''
    Registers routes with the application.
    '''
    def get_error_handler(request_path, status_code):
        '''
        Custom 404 and 405 error handlers for blueprints are not currently
        working because routing happens at the app level, not blueprint level
        (see https://github.com/pallets/flask/issues/503). The workaround
        proposed in that issue suggests routing 404 errors to the appropriate
        blueprint error handler from the app level 404 handler.
        '''
        for name, bp in app.blueprints.items():
            if request_path.startswith(bp.url_prefix):
                error_handlers = app.error_handler_spec.get(name, dict())
                handler = list(error_handlers.get(status_code).values())[0]

                return handler

        return None

    @app.route('/', methods=['GET'])
    def index():
        return render_template('index.html')

    @app.route('/about', methods=['GET'])
    def about():
        return render_template('about.html')

    @app.route('/map', methods=['GET'])
    def webmap():
        return render_template('map.html')

    @app.route('/gallery', methods=['GET'])
    def gallery():
        return render_template('gallery.html')

    @app.route('/photo-gallery', methods=['GET'])
    def photo_gallery():
        google_credentials = getattr(app, 'google_credentials', None)

        if google_credentials:
            app.logger.debug('found credentials!')

            media = utils.load_photos_album(app.config['PHOTO_GALLERY_ALBUM_ID'])
            media.reverse()

            return render_template('photo-gallery.html', media=media)

        authorization_url = utils.google_auth()

        return redirect(authorization_url)

    @app.route('/contact', methods=['GET'])
    def contact():
        return render_template('contact.html')

    @app.errorhandler(404)
    def not_found(error):
        '''
        Custom 404 error handler. Returns the 404 page unless
        the request was for a URL from the api blueprint.
        '''
        app.logger.error(error)
        handler = get_error_handler(request_path=request.path, status_code=404)

        if handler:
            return handler(error)

        return make_response(render_template('errors/404.html'), 404)

    @app.errorhandler(500)
    def internal_error(error):
        '''
        Custom 500 page.
        '''
        app.logger.error(error)
        return make_response(render_template('errors/500.html'), 500)
