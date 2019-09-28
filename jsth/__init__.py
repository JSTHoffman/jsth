'''
This is the Flask application factory. It creates an instance of
the application configured for the environment in which it will run.

For more information see http://flask.pocoo.org/docs/dev/tutorial/factory/
'''


import os

from flask import Flask

from jsth import config
from jsth.api import api
# from jsth.db import init_db
from jsth.routes import register_routes


def create_app():
    '''
    Creates and configures the application.
    '''
    env = os.getenv('FLASK_ENV', 'local')

    # INSTANCE RELATIVE CONFIG TELLS FLASK TO USE
    # CONFIG FILES LOCATED IN THE INSTANCE DIRECTORY
    app = Flask(__name__, instance_relative_config=True)

    with app.app_context():
        # LOAD DEFAULT CONFIGURATION
        app.config.from_object(config.app_config[env])

        # REGISTER APP LEVEL ROUTES
        register_routes(app)

        # REGISTER BLUEPRINTS
        app.register_blueprint(api)

        # INITIALIZE DATABASE
        # init_db(app)

        # REGISTER CUSTOM CLI COMMANDS
        # app.cli.add_command(user_cli)

    return app
