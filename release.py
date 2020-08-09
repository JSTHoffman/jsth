'''
The release module contains functions that will be executed during
Heroku's release phase. This includes some flask specific tasks
like ensuring the instance directory exists, and application tasks
like running database migrations. It'll be pretty empty to start out.
'''


import os


def release():
    '''
    Runs Heroku release phase tasks.
    '''
    if not os.path.exists('instance'):
        os.makedirs('instance')

    with open('instance/google_credentials.json', 'w') as fh:
        fh.write(os.getenv('GOOGLE_CREDENTIALS'))


def db_migrate():
    '''
    Runs migrations on the application database.
    '''


if __name__ == '__main__':
    release()
