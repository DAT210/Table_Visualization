from flask import Flask, render_template, Blueprint, request, redirect, url_for, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
import requests
from get_functions import *
from insert_functions import *
from update_functions import *

user_blueprint = Blueprint('user', __name__)


@user_blueprint.route('/')
def index():
    return redirect("/table/oslo")


@user_blueprint.route('/table/<tablename>')
def table(tablename):
    session.pop('admin-roomplan', None)
    session['user-roomplan'] = tablename
    return render_template("index.html")


"""Legger til booked-status i jsonfila fra databasen, utifra det vi får fra booking API"""
@user_blueprint.route('/bookedTables')
def getTables():
    tableIDs = []
    rawData = apiTest()
    """Må load jsonfila for å letter kunne endre på den, mulig dette er unødvendig"""
    bookingData = json.loads(rawData)
    restaurant = bookingData["restaurant"]
    bookedTables = bookingData["tables"]
    rawDbData = get_json_setup(restaurant)
    dbData = json.loads(rawDbData)
    allTables = dbData["tables"]

    for i in range(len(bookedTables)):
        tableIDs.append(bookedTables[i])

    for j in range(len(allTables)):
        if allTables[j]["id"] in tableIDs:
            allTables[j].update({"booked": 1})
        else:
            allTables[j].update({"booked": 0})

    return json.dumps(dbData)


"""Simulerer json fila vi får fra booking API-en"""
@user_blueprint.route('/api/booking')
def apiTest():
    data = {"tables": [1, 3], "restaurant": "oslo"}
    return json.dumps(data)
