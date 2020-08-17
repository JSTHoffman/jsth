'''
This is the Flask application factory. It creates an instance of
the application configured for the environment in which it will run.

For more information see http://flask.pocoo.org/docs/dev/tutorial/factory/
'''


import logging
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

    # Set log level
    if env == 'production':
        app.logger.setLevel(logging.INFO)
    else:
        app.logger.setLevel(logging.DEBUG)

    app.logger.info('Environment: %s', env)

    with app.app_context():
        # Load default configuration
        app.config.from_object(config.app_config[env])

        # Set content security policy using Talisman
        Talisman(app, content_security_policy=app.config['CSP'])

        # Register app level routes
        register_routes(app)

        # Register blueprints
        app.register_blueprint(api_bp)

        # Create instance directory
        create_instance_dir(app)

        # Initialize database
        # init_db(app)

        # Register custom cli commands
        # app.cli.add_command(user_cli)

    return app


def create_instance_dir(app):
    app.logger.info('checking for instance directory...')
    if not os.path.exists(app.instance_path):
        app.logger.info('creating instance directory...')
        os.makedirs(app.instance_path)
    else:
        app.logger.info('instance directory found!')

    app.logger.info('writing google credentials to instance directory...')
    with open(f'{app.instance_path}/google_credentials.json', 'w') as fh:
        fh.write(os.getenv('GOOGLE_CREDENTIALS'))
