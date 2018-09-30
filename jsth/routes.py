'''
All application routes.
'''

from flask import (
    jsonify,
    make_response,
    render_template,
    request
)


def register_routes(app):
    '''
    Registers routes with the application.
    '''
    @app.route('/', methods=['GET'])
    def index():
        return render_template('index.html')

    @app.route('/about', methods=['GET'])
    def about():
        return render_template('about.html')
