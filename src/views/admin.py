from flask import Flask, render_template, Blueprint, request, redirect, url_for, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
import requests
from get_functions import *
from insert_functions import *
from update_functions import *

admin_blueprint = Blueprint('admin', __name__)


######################################
############ AJAX routes #############
######################################

# Denne kjøres når det kommer forespørsel om å sette inn nytt bordoppsett i databasen
@admin_blueprint.route('/update', methods=['POST'])
def update():
    if request.method == 'POST':
        data = request.get_json()
        table_status = data[0]["status"]
        table_name = session.get('admin-roomplan')
        if table_status == 'update':
            return update_roomplan(table_name, data)



# Denne kjøres når det kommer forespørsel om å sette inn nytt bordoppsett i databasen
@admin_blueprint.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        data = request.get_json()
        table_name = data[0]["name"]
        table_status = data[0]["status"]

        if table_status == "add":
            response = get_db_status(table_name)
            if response["status"] == "error":
                return json.dumps(response)

            insert_roomplan(table_name.lower(),data)

            session["admin-roomplan"] = table_name
            message = {
                "status": "success",
                "message": "Successfully added to database"
            }
            return json.dumps(message)




@admin_blueprint.route('/clear/session', methods=['POST', 'GET'])
def clear():
    if request.method == 'GET':
        session.clear()
        return redirect('/admin')

    else:
        return redirect('/admin')


########################################################################################
############ Admin route brukes til å slette og lage bordoppsett #######################
########################################################################################

@admin_blueprint.route('/admin', methods=['GET', 'POST'])
def admin():
    session.pop('user-roomplan', None)
    restaurant_list = get_restaurants()
    if request.method == 'POST':
        ### Hvis noen prøver slette et bordoppsett
        if request.form['submit_button'] == 'Delete table layout':
            deleted_table = request.form.get("deletedname")
            deleted_rows = Roomplan.query.filter_by(name=deleted_table)
            try:
                deleted_rows.delete()
                db.session.commit()
                session.clear()
            except:
                print("error")
        return redirect("/admin")
    else:
        if 'admin-roomplan' in session:
            sessionResponse = session.get('admin-roomplan')
            return render_template("admin.html", restaurants=restaurant_list, session=sessionResponse)
        else:
            return render_template("admin.html", restaurants=restaurant_list)



#####################################################################################################
############ Forskjellige routes som brukes til å generere json bordoppsettet #######################
#####################################################################################################

# Denne kalles fra html når man ønsker laste inn et eksisterende bordoppsett
# Setter session lik restauranten de valgte og redirecter til /admin som vil håndtere det å vise bordoppsettet
@admin_blueprint.route('/load/admin', methods=['POST'])
def load():
    if request.method == 'POST':
        restaurant = request.form.get("restaurants")
        session['admin-roomplan'] = restaurant
        return redirect("/admin")
    else:
        return redirect("/admin")




# Bare en route for å vise json fil til hvert bord
@admin_blueprint.route('/api/<tablename>')
def api(tablename):
    return get_json_setup(tablename)



# Dette er funksjonen som finner hvilket bordoppsett som skal sendes til javascripten som tegner bordet
# Admin og brukeren har forskjellige session verdier for å ikke skape konflikter mellom dem
@admin_blueprint.route('/load/json')
def loadjson():
    if 'user-roomplan' in session:
        return get_json_setup(session['user-roomplan'])
    if 'admin-roomplan' in session:
        return get_json_setup(session['admin-roomplan'])
    else:
        return get_json_setup("basic")
