from sqlalchemy_utils import database_exists, create_database, drop_database
from __init__ import DB_URL, db
from create_tables import start_tables

if database_exists(DB_URL):
    print('Deleting database.')
    drop_database(DB_URL)
if not database_exists(DB_URL):
    print('Creating database.')
    create_database(DB_URL)

print('Creating tables.')
db.create_all()

# Loads a bunch of tables into the database
start_tables()

print('Done with init!')