'''
This is the Flask application factory. It creates an instance of
the application configured for the environment in which it will run.

For more information see http://flask.pocoo.org/docs/dev/tutorial/factory/
'''


import os

from flask import Flask
from flask_talisman import Talisman

from jsth import config
from jsth.api import api_bp
# from jsth.db import init_db
from jsth.routes import register_routes


def create_app():
    '''
    Creates and configures the application.
    '''
    env = os.getenv('FLASK_ENV', 'local')

    # instance_relative_config tells flask to use
    # config files located in the instance directory
    app = Flask(__name__, instance_relative_config=True)

    with app.app_context():
        # Load default configuration
        app.config.from_object(config.app_config[env])

        # Set content security policy using Talisman
        Talisman(app, content_security_policy=app.config['CSP'])

        # Register app level routes
        register_routes(app)

        # Register blueprints
        app.register_blueprint(api_bp)

        # Initialize database
        # init_db(app)

        # Register custom cli commands
        # app.cli.add_command(user_cli)

    return app
