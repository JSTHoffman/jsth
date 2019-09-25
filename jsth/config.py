'''
Configuration module for mugatu. Contains settings specific
to local, development, and production environments.
'''


import os


class Config(object):
    '''
    Parent configuration class.
    '''
    DEBUG = True
    CSRF_ENABLED = True
    SECRET_KEY = os.getenv('SECRET_KEY')

    DATABASE = 'jsth.sqlite'


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
