
[![N|Solid](https://i.imgur.com/VWF4BmY.png)]()

## Table of Contents:

1. [Overview](#Overview)
2. [Setup ](#setup-and-run)
	* [Run in docker](#docker)
	* [Setting up dev](#dev)
3. [Usage](#usage)
    * [Admin](#api-get)
    * [User](#api-post)
    * [Tests](#api-patch)


This project provides a visualization of the restaurants roomplans. 

# Setup
#### Run in docker
Make sure you have docker installed before testing this project:
```sh
docker -v
```
If not, download on: https://www.docker.com/

##### Set up git repository
#
```sh
git clone https://github.com/DAT210/Table_Visualization.git
cd into the repository location
```
##### Build the images and run containers
#
```sh
docker-compose up -d --build
```
This will build and start running two containers. The app should be visible at: 
http://127.0.0.1:4000/ (Docker) 
http://192.168.99.100:4000/ (Docker toolbox)

PostgreSQL port:5432
##### Automatically populate database from python file

Run this to automatically create a database named "mydb" inside the postgres server. The database.py file will set up a database and create tables with inserts statements found in create_tables.py file.
```sh
docker-compose exec app python database.py 
```
You can now bash into the postgres server and \c mydb. The \d will then list the tables on mydb, and 
select * from [table name] will show all of the entries.

##### Connect to the database container
You can bash into the postgres server currently running by entering:
```sh
docker exec -it postgresql psql -U postgres
```
Useful commands inside the postgres server:
```sh
\l    (list of databases)
\c    (connect to a database)
\d    (List of tables inside the database)
\q    (To exit the postgres server)
```
#### Setting up dev
You need to install Python3 and Postgres on your machine to run this code locally. After the git repo is cloned, enter the repo and set up a virtual environment to run on
```sh
python -m pip install virtualenv
virtualenv venv
```
Activate the venv
```sh
source venv/bin/activate
```
Then, install the required dependencies 
```sh
python -m pip install Flask
python -m pip install SqlAlchemy
python -m pip install Flask-SQLAlchemy
python -m pip install pytest
python -m pip install psycopg2
python -m pip install requests
```

You need to install TypeScript aswell if you want to develop the room visualizer further.
```sh
npm install -g typescript
```
Compile the TypeScript into JavaScript by entering
```sh
tsc
```
into cmd or terminal
##### Add config
Run these commands in cmd or terminal to export environment variables needed
```sh
export POSTGRES_URL="localhost:5432"
export POSTGRES_USER="postgres"
export POSTGRES_PW="dbpw"
export POSTGRES_DB="test"
export APP_KEY='SomeRandomKey'
export APP_SETTINGS="config.DevelopmentConfig"
```
##### Run the code locally
The project should be able to run smoothly at this point. Now you have to simply run the database file to populate the database with initial data. Then start the app, which should be available on local host
```sh
python database.py
python app.py
```

# Usage
#### Admin page
Edit or create your own roomplans at
```sh
http://127.0.0.1:4000/admin
```
The admin page contains a bunch of useful functionality and editing tools

| Options | Functionality |
| ------ | ------ |
| Load| Load an existing restaurants roomplan|
| New | Creates a blank canvas you can draw on|
| Add tables | Add table to the roomplan |
| Add walls | Add a path of walls to the roomplan|
| Update | Update the current roomplan |
| Save | Save the roomplan as a new setup |
| Delete| Delete a roomplan from the database|

[![N|Solid](https://i.imgur.com/g7vclav.png)]()
#### User page
The table visualization of a restaurant is accessible at 
```sh
http://127.0.0.1:4000/table/<restname>
```

{
  "tables": [1, 3], 
  "nrOfPeople": 8
  "rest": "oslo"
}


Color identifiers on the tables tells the user if a table is booked or not. A small number on the table implicates how many people this table can fit. The user can choose which of the available tables to book. The user then confirms the booking, and our software checks weather or not the chosen tables fits enough people compared to the booking data they sent in. 

#### Other feautures
| Function | URL |
| ------ | ------ |
| List of stored restaurants in JSON | [http://`<host>`/api/restaurants][editevents] |
| All data of the roomplan in JSON | [http://`<host>`/api/<tablename>][editevents] |

#### Tests
The unit tests is written inside the tests folder. Simply run
```sh
py.test
```
into the cmd or terminal to automatically run all of the tests. 
