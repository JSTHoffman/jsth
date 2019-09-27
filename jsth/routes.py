'''
All application routes.
'''

from flask import (
    render_template
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

    @app.route('/map', methods=['GET'])
    def webmap():
        return render_template('map.html')

    @app.route('/gallery', methods=['GET'])
    def gallery():
        return render_template('gallery.html')

    @app.route('/contact', methods=['GET'])
    def contact():
        return render_template('contact.html')
