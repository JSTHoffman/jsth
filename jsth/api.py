'''
"Backend" endpoints called by client side code
for tasks like loading files or generating access tokens.
'''


import os

from flask import (
    abort,
    Blueprint,
    current_app as app,
    jsonify,
    make_response,
    redirect,
    request,
    url_for
)

from google_auth_oauthlib.flow import Flow


api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/get-geojson/<filename>', methods=['GET'])
def load_geojson(filename):
    '''
    Gets the specified geojson file from the
    static directory and returns its contents.
    '''
    try:
        return app.send_static_file(f'geojson/{filename}')

    except FileNotFoundError:
        app.logger.error(f'geojson file {filename} was not found.')
        abort(404)


@api_bp.route('/auth/google/callback', methods=['GET'])
def google_auth_callback():
    flow = Flow.from_client_secrets_file(
        os.path.join('instance', 'google_credentials.json'),
        scopes=['https://www.googleapis.com/auth/photoslibrary.readonly'],
    )

    flow.redirect_uri = url_for('api.google_auth_callback', _external=True)

    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)

    if 'error' in authorization_response:
        return make_response(jsonify({
            'status': 401,
            'success': False,
            'message': f"authentication error: {authorization_response['error']}"
        }))
    else:
        app.google_credentials = flow.credentials

        return redirect(url_for('photo_gallery'))


@api_bp.errorhandler(404)
def not_found_error(error):
    '''
    Custom 404 response.
    '''
    return make_response(jsonify(
        {
            'success': False,
            'status': 404,
            'message': str(error)
        }
    ), 404)


@api_bp.errorhandler(500)
def internal_error(error):
    '''
    Custom 500 response.
    '''
    return make_response(jsonify(
        {
            'success': False,
            'status': 500,
            'message': str(error)
        }
    ), 500)
