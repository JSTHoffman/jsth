'''
The release module contains functions that will be executed during
Heroku's release phase. This includes some flask specific tasks
like ensuring the instance directory exists, and application tasks
like running database migrations. It'll be pretty empty to start out.
'''


import logging
import os


def release():
    '''
    Runs Heroku release phase tasks.
    '''
    logging.info('checking for instance directory...')
    if not os.path.exists('instance'):
        logging.info('creating instance directory...')
        os.makedirs('instance')
    else:
        logging.info('instance directory found!')

    logging.info('writing google credentials to instance directory...')
    with open('instance/google_credentials.json', 'w') as fh:
        fh.write(os.getenv('GOOGLE_CREDENTIALS'))

    files = os.listdir('./instance')
    logging.info('instance directory contents: %s', files)

    logging.info('release tasks complete!')


def db_migrate():
    '''
    Runs migrations on the application database.
    '''


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    release()
