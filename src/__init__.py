from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask


def get_env_variable(name):
    try:
        return os.environ[name]
    except KeyError:
        message = "Expected environment variable '{}' not set.".format(name)
        raise Exception(message)


# Henter inn environment variablene for å sette opp Postgres databse
POSTGRES_URL = get_env_variable("POSTGRES_URL")
POSTGRES_USER = get_env_variable("POSTGRES_USER")
POSTGRES_PW = get_env_variable("POSTGRES_PW")
POSTGRES_DB = get_env_variable("POSTGRES_DB")
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)



app = Flask(__name__, instance_relative_config=True)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)


####################
#### blueprints ####
####################

from src.views.admin import admin_blueprint
from src.views.user import user_blueprint

# register the blueprints
app.register_blueprint(admin_blueprint)
app.register_blueprint(user_blueprint)