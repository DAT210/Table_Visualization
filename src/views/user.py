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