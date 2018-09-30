'''
This is the Flask application factory. It creates an instance of
the application configured for the environment in which it will run.

For more information see http://flask.pocoo.org/docs/dev/tutorial/factory/
'''

import json
import os

from flask import (
    Flask,
    jsonify,
    make_response,
    request
)

from jsth import config
from jsth import routes


def create_app():
    '''
    Creates and configures the application.
    '''
    env = os.getenv('FLASK_ENV', 'local')

    # INSTANCE RELATIVE CONFIG TELLS FLASK TO USE
    # CONFIG FILES LOCATED IN THE INSTANCE DIRECTORY
    app = Flask(__name__, instance_relative_config=True)

    # LOAD DEFAULT CONFIGURATION
    app.config.from_object(config.app_config[env])

    # REGISTER APP LEVEL ROUTES
    routes.register_routes(app)

    # REGISTER BLUEPRINTS
    # app.register_blueprint()

    # REGISTER DATABASE COMMANDS
    # db.init_app(app)

    # REGISTER CUSTOM CLI COMMANDS
    # app.cli.add_command(user_cli)

    return app
