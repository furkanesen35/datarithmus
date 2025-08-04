# Google Meet Spaces API Setup Guide

## 1. Enable Google Meet Spaces API

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/library
2. Search for "Google Meet API" or "Google Workspace APIs"
3. Enable the "Google Meet API"

## 2. Create OAuth 2.0 Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Datarithmus LMS Google Meet Integration"
5. Authorized JavaScript origins:
   - http://localhost:3000 (for development)
   - https://yourdomain.com (for production)
6. Authorized redirect URIs:
   - http://localhost:3000/api/auth/google/callback
   - https://yourdomain.com/api/auth/google/callback

## 3. Download Credentials

- Download the JSON file with your client ID and secret
- Add them to .env.local

## 4. Required Scopes

- https://www.googleapis.com/auth/meetings.space.created
- https://www.googleapis.com/auth/meetings.space.readonly

## 5. Important Notes

- Spaces API requires user authentication (OAuth 2.0)
- Each user needs to grant permission to create meetings
- Created spaces are permanent until deleted
- Spaces can be shared with anyone via the meet link
