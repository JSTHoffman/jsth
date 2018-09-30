'''
The wsgi module is necessary to serve a flask app with
gunicorn when using the application factory model. Gunicorn
needs to be pointed at an instance of the flask app which
can only be accomplished when the app instance is referenced
by a module variable.
'''


from jsth import create_app


app = create_app()
