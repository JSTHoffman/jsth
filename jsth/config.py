'''
The config module contains settings specific
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
    GOOGLE_CREDENTIALS_FILE = 'google_credentials.json'

    DATABASE = 'jsth.sqlite'

    PHOTO_GALLERY_ALBUM_ID = 'ANSNXO_rLAuJRTak0ElJ1sbi5EJdPxQYiCJPmh9OsKBoHlxxDdr0XZjBfJcAW3YtB0c2kWqyEDUj'
    PHOTO_GALLERY_MEDIA_FILE = 'photo_album_media.json'

    # Custom content security policy
    # using Google CSP as the base
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
