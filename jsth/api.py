'''
Endpoints called by the client side javascript.
'''


import json

from flask import (
    abort,
    Blueprint,
    current_app as app,
    jsonify,
    make_response
)


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/get-geojson/<filename>', methods=['GET'])
def load_geojson(filename):
    '''
    Gets the requested geojson file from the
    static directory and returns its contents.
    '''
    try:
        return app.send_static_file(f'geojson/{filename}')

    except FileNotFoundError:
        app.logger.error(f'geojson file {filename} was not found.')
        abort(404)


@api.errorhandler(404)
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


@api.errorhandler(500)
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