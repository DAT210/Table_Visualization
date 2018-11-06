from flask import Flask, render_template, Blueprint, request, redirect, url_for, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
import requests
from get_functions import *
from insert_functions import *
from update_functions import *
from delete_functions import *


admin_blueprint = Blueprint('admin', __name__)


@admin_blueprint.route('/update', methods=['POST'])
def update():
    if request.method == 'POST':
        data = request.get_json()
        table_name = session.get('admin-roomplan')
        return update_roomplan(table_name, data)


@admin_blueprint.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        data = request.get_json()
        table_name = data["name"]
        response = get_db_status(table_name, data)
        if response["status"] == "error":
            print(response)
            return json.dumps(response)
        
        insert_roomplan(table_name.lower(),data)

        session["admin-roomplan"] = table_name
        message = {
            "status": "success",
            "message": "Successfully added to database"
        }
        return json.dumps(message)


@admin_blueprint.route('/delete', methods=['POST'])
def delete():
    if request.method == 'POST':
        deleted_table = request.form.get("deletedname")
        delete_roomplan(deleted_table)
        return redirect("/admin")
    else:
        return redirect("/admin")



@admin_blueprint.route('/clear/session', methods=['GET'])
def clear():
    if request.method == 'GET':
        session.clear()
        return redirect('/admin')
    else:
        return redirect('/admin')


@admin_blueprint.route('/admin')
def admin():
    session.pop('user-roomplan', None)
    restaurant_list = get_restaurants()
    if 'admin-roomplan' in session:
        sessionResponse = session.get('admin-roomplan')
        return render_template("admin.html", restaurants=restaurant_list, session=sessionResponse)
    else:
        return render_template("admin.html", restaurants=restaurant_list, newroomplan="ok")


# Denne kalles fra html når man ønsker laste inn et eksisterende bordoppsett
# Setter session lik restauranten de valgte og redirecter til /admin som vil håndtere det å vise bordoppsettet
@admin_blueprint.route('/load/admin', methods=['POST'])
def load():
    if request.method == 'POST':
        restaurant = request.form.get("restaurants")
        print(restaurant)
        session['admin-roomplan'] = restaurant
        return redirect("/admin")
    else:
        return redirect("/admin")


@admin_blueprint.route('/search', methods=['POST'])
def search():
    if request.method == 'POST':
        session.clear()
        search = request.form.get("search").lower()
        restaurants = get_restaurants()
        if search in restaurants:
            session['admin-roomplan'] = search
    return redirect("/admin")    

# Bare en route for å vise json fil til hvert bord
@admin_blueprint.route('/api/<tablename>')
def api(tablename):
    return get_json_setup(tablename)

@admin_blueprint.route('/api/restaurants')
def restaurants():
    restaurants = get_restaurants()
    return json.dumps(restaurants)


@admin_blueprint.route('/load/json')
def loadjson():
    if 'user-roomplan' in session:
        return get_json_setup(session['user-roomplan'])
    if 'admin-roomplan' in session:
        return get_json_setup(session['admin-roomplan'])
    else:
        return get_json_setup("basic")

