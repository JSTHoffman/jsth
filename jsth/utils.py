'''
Helper functions for various backend tasks.
'''

import json
import os

import requests

from flask import (
    current_app as app,
    url_for
)

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build


def load_photos_album(album_id):
    '''
    Gets the specified Google Photos album from the photos API.
    '''
    def paginated_results(req):
        '''
        Pages through all results for the provided request.
        '''
        while req:
            res = req.execute()
            req = photos_api.mediaItems().list_next(req, res)

            for item in res['mediaItems']:
                yield item

    def valid_media_url(url):
        '''
        Requests a photo URL. Returns True if the response is 200.
        '''
        res = requests.get(url)

        return res.status_code == 200

    path = os.path.join(app.instance_path, app.config['PHOTO_GALLERY_MEDIA_FILE'])

    # Return cached data if it hasn't expired
    if os.path.exists(path):
        with open(path, 'r') as fh:
            data = json.load(fh)

        url = data[0]['baseUrl']

        if valid_media_url(url):
            app.logger.debug('photo album already loaded')
            return data

    # Authenticate client and make API request if data isn't cached
    app.logger.debug('creating photos client...')
    photos_api = build('photoslibrary', 'v1', credentials=app.google_credentials)

    app.logger.debug('requesting photo album...')
    body = {'albumId': album_id}
    req = photos_api.mediaItems().search(body=body)
    data = list(paginated_results(req))

    # Cache album data
    with open(path, 'w') as fh:
        json.dump(data, fh)

    return data


def google_auth():
    '''
    Handles authentication of the Google Photos API.
    '''
    flow = Flow.from_client_config(
        json.loads(os.getenv('GOOGLE_CREDENTIALS')),
        scopes=['https://www.googleapis.com/auth/photoslibrary.readonly']
    )

    flow.redirect_uri = url_for('api.google_auth_callback', _external=True)

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )

    return authorization_url
