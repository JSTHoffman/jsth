'''
Configuration module for mugatu. Contains settings specific
to local, development, and production environments.
'''


import os

from flask_talisman import GOOGLE_CSP_POLICY


class Config(object):
    '''
    Parent configuration class.
    '''
    DEBUG = True
    CSRF_ENABLED = True
    SECRET_KEY = os.getenv('SECRET_KEY')

    DATABASE = 'jsth.sqlite'

    # CUSTOM CONTENT SECURITY POLICY
    # USING GOOGLE CSP AS THE BASE
    CSP = GOOGLE_CSP_POLICY
    CSP.update({
        'default-src': [
            '\'self\'',
        ],
        'connect-src': [
            '\'self\'',
            'www.hikingproject.com',
            '*.google-analytics.com'
        ],
        'script-src': [
            '\'self\'',
            '\'unsafe-eval\'',
            '\'unsafe-inline\'',
            '*.bootstrapcdn.com',
            '*.cloudflare.com',
            '*.fontawesome.com',
            '*.google-analytics.com',
            '*.googletagmanager.com',
            '*.jsdelivr.net',
            '*.jquery.com',
            '*.mapbox.com',
            'unpkg.com'
        ],
        'style-src': [
            '\'self\'',
            '\'unsafe-inline\'',
            '*.bootstrapcdn.com',
            '*.fontawesome.com',
            '*.googleapis.com',
            '*.jsdelivr.net',
            '*.mapbox.com',
            'unpkg.com'
        ],
        'font-src': [
            '*.fontawesome.com',
            '*.gstatic.com'
        ],
        'img-src': [
            '*',
            'data:'
        ]
    })


class TestingConfig(Config):
    '''
    Settings for testing... data comes from...
    '''
    TESTING = True


class DevelopmentConfig(Config):
    '''
    Settings for development environment.
    '''
    DEBUG = False


class ProductionConfig(DevelopmentConfig):
    '''
    Settings for production are inherited from the development config.
    '''
    DEBUG = False


app_config = {
    'local': Config,
    'testing': TestingConfig,
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
