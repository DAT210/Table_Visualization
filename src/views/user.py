from flask import Flask, render_template, Blueprint, request, redirect, url_for, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
import requests
from get_functions import *
from insert_functions import *
from update_functions import *
from flask import Response
from flask import request

user_blueprint = Blueprint('user', __name__)


@user_blueprint.route('/')
def index():
    return redirect("/table/bergen")

@user_blueprint.route('/test')
def testing():
    return render_template("test.html")

@user_blueprint.route('/table/<tablename>')
def table(tablename):
    session.pop('admin-roomplan', None)
    session['user-roomplan'] = tablename
    return render_template("index.html")

@user_blueprint.route('/api/booking/posttables', methods=['POST'])
def ourAPItest():
    d = request.get_json()
    t = requests.post('https://jsonplaceholder.typicode.com/posts', json=d)
    return Response(t, status=200)

@user_blueprint.route('/api/booking/<restname>')
def apiTest(restname):
    data = {"tables": [1, 4], "nrOfPeople": 3, "name": restname}
    return json.dumps(data)
