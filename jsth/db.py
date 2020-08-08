'''
This is the application database module. It handles connections
to the application database (sqlite) which is used to store...we'll see.
It also creates CLI commands for initializing the sqlite database
and registers the close_db() function with the app.

For more info see http://flask.pocoo.org/docs/tutorial/database/
'''


import os
import sqlite3

from flask import (
    current_app as app,
    g
)


def get_db():
    '''
    Creates a connection to the application database if one doesn't
    exist in the request object g. Otherwise returns the existing connection.

    NOTE: g is a special oject that's unique for each request and can be
    used to store data available to multiple functions during a request.
    For more info see http://flask.pocoo.org/docs/1.0/appcontext/#storing-data
    '''
    if 'sqlite' not in g:
        g.sqlite = sqlite3.connect(
            os.path.join(app.instance_path, app.config['DATABASE']),
            detect_types=sqlite3.PARSE_DECLTYPES
        )

        # Tells the connection to return
        # rows that behave like python dicts
        g.sqlite.row_factory = sqlite3.Row

    return g.sqlite


def init_db(app):
    '''
    Initializes an instance of the sqlite database and registers the
    close_db function with the @app.teardown_appcontext decorator.
    '''
    db = get_db()

    # Open and execute init script
    with app.open_resource('schema.sql') as sql_file:
        db.executescript(sql_file.read().decode('utf8'))

    # Close the database connection
    # at the end of each request
    app.teardown_appcontext(close_db)


def close_db(e=None):
    '''
    Closes any existing database connections.
    '''
    db = g.pop('sqlite', None)

    if db is not None:
        db.close()
