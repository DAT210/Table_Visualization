
# Table Visulization &middot; [![Build Status](https://img.shields.io/travis/npm/npm/latest.svg?style=flat-square)](https://travis-ci.org/npm/npm) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)
> Additional information or tag line

Table Visualization is made by Group 3

## Installing / Getting started

Make sure you have docker installed before testing this project:
```shell
docker -v
```
If not, download on: https://www.docker.com/

### Set up git repository
```shell
git clone https://github.com/DAT210/Table_Visualization.git
cd into the repository location
```

### Build the images and run containers
```shell
docker-compose up -d --build
```
This will build and start running two containers.  The app should be visible at:  <br />
http://127.0.0.1:4000/    (Docker) <br />
http://192.168.99.100:4000/    (Docker toolbox)

PostgreSQL port:5432

### Connect to the database container
You can bash into the postgres server currently running by entering:
```shell
docker exec -it postgresql psql -U postgres
```
Useful commands inside the postgres server:
```shell
\l    (list of databases)
\c    (connect to a database)
\d    (List of tables inside the database)
\q    (To exit the postgres server)
```
### Automatically populate database from python file
Run this to automatically create a database named "mydb" inside the postgres server. The database.py file will set up
a database and create tables with inserts statements found in create_tables.py file.
```shell
docker-compose exec app python src/database.py 
```
You can now bash into the postgres server and \c mydb. The \d will then list the tables on mydb, and <br /> select * from [table name] will show all of the entries.

## Developing

### Built With
List main libraries, frameworks used including versions (React, Angular etc...)

### Prerequisites
What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.


### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/your/your-project.git
cd your-project/
packagemanager install
```

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here. for example:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing
give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We can maybe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).


## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

<b>Typescript</b><br>

Install mocha/chai and types:

```shell
npm i -D chai mocha nyc ts-node typescript
npm i -D @types/chai @types/mocha
```

Run Tests:

```shell
npm test
```

## Style guide

Explain your code style and show how to check it.

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.


## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc... 

## Licensing

State what the license is and how to find the text version of the license.
