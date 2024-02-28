from pathlib import Path
import os

# Définition du répertoire racine de votre projet Django
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Configuration des paramètres MEDIA pour le stockage des fichiers médias
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Autres paramètres de configuration...


# Build paths inside the project like this: BASE_DIR / 'subdir'.
#BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-_gpjt-re1vo^qvm%*t4zpx5f6jc(%u(^0l6-q9b4l!e!gi0*cu'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1'] 


# Application definition

INSTALLED_APPS = [
    'back.apps.BackConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'dj_rest_auth',
    'rest_framework',
    'rest_framework.authtoken',
    'social_django',
    'dj_rest_auth.registration',
    'django.contrib.sites',
    'oauth2_provider',
    'sslserver',
]


AUTHENTICATION_BACKENDS = [
    'social_core.backends.42.EDXOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]


SOCIALACCOUNT_PROVIDERS = {
    '42': {
        'APP': {
            'client_id': os.environ.get('CLIENT_ID', ''),
            'secret': os.environ.get('CLIENT_SECRET', ''),
            'key': '',
            'scope': ['public', 'profile', 'email'],
            'auth_params': {'access_type': 'online'},
            'redirect_uris': [
                'https://localhost:3000/callback',
                'https://127.0.0.1:3000/callback',
            ],
        }
    }
}


SOCIAL_AUTH_42_KEY = 'u-s4t2ud-ab0a2c4d071ad2ab41a09ecc31c56a394d7d0ffe63be47f4cd76e20ae87e843e'
SOCIAL_AUTH_42_SECRET = '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'
SOCIAL_AUTH_42_SCOPE = ['public']
LOGIN_URL = 'login'
LOGOUT_URL = 'logout'
LOGIN_REDIRECT_URL = 'https://localhost:3000/callback'

MIDDLEWARE = [
    # CORS
    'corsheaders.middleware.CorsMiddleware',
    # Default
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
    # Ajoutez le middleware allauth.account.middleware.AccountMiddleware ici
  # 'allauth.account.middleware.AccountMiddleware',
  #  'django.contrib.sites.middleware.CurrentSiteMiddleware',
]

USE_SSL = True
#SITE_ID = 1

CORS_ALLOWED_ORIGINS = [
    "https://localhost:3000",
    "https://localhost:8080",
    "https://127.0.0.1:3000",
    "https://127.0.0.1:8080",

]


REST_USE_JWT = True

ROOT_URLCONF = 'back.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

#WSGI_APPLICATION = 'wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        "NAME": "django_db",
        "USER": "msebbane",
        "PASSWORD": "pass",
        "HOST": "database",
        "PORT": "5432",
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

SECURE_SSL_REDIRECT = True

USE_SSL = True

# Paramètres de sécurité liés à HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
