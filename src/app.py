from flask import Flask, flash, render_template, Blueprint, request, redirect, url_for, flash, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
from sqlalchemy import update, func
import requests
from functions import generateJSON, getRestaurantList, newRoomplan,returnDatabaseStatus
app.secret_key = 'some_secret'

@app.route('/')
def index():
    return redirect("/table/oslo")


@app.route('/table/<tablename>')
def table(tablename):
    session.pop('admin-roomplan', None)
    session['user-roomplan'] = tablename
    return render_template("index.html")

######################################
############ AJAX routes #############
######################################

# Denne kjøres når det kommer forespørsel om å sette inn nytt bordoppsett i databasen
@app.route('/newroom', methods=['POST'])
def test():
    if request.method == 'POST':
        data = request.get_json()
        table_name = data[0]["name"]
        table_status = data[0]["status"]
        print(table_name + " has " + table_status + " as a status")

        # Sjekk at dette navnet er greit å sette inn i databasen
        if table_status == "new":
            response = returnDatabaseStatus(table_name)
            if response["status"] == "error":
                return json.dumps(returnDatabaseStatus(table_name))

        # Prøv å slett den som ligger fra før
        if table_status == 'update':
            table_name = session.get('admin-roomplan')
            deleted_rows = Roomplan.query.filter_by(name=table_name)
            try:
                deleted_rows.delete()
                db.session.commit()
            except:
                return json.dumps({"status": "error","message": "Could not update this restaurant"})

        for key in data:
            id = key["id"]
            xpos = key["xpos"]
            ypos = key["ypos"]
            width = key["width"]
            height = key["height"]
            name = key["name"].lower()
            value = key["status"]

            if table_status == "update":
                name = table_name
            newRoomplan(id,xpos,ypos,width,height,name)

        session["admin-roomplan"] = table_name
        message = {"status": "success", "message": "Successfully added to database"}
        return json.dumps(message)

    return json.dumps("error")


@app.route('/clear/session', methods=['POST', 'GET'])
def clear():
    if request.method == 'GET':
        session.clear()
        return redirect('/admin')

    else:
        return redirect('/admin')


########################################################################################
############ Admin route brukes til å slette og lage bordoppsett #######################
########################################################################################

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    session.pop('user-roomplan', None)
    restaurant_list = getRestaurantList()
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
@app.route('/load/admin', methods=['POST'])
def load():
    if request.method == 'POST':
        restaurant = request.form.get("restaurants")
        session['admin-roomplan'] = restaurant
        return redirect("/admin")
    else:
        return redirect("/admin")




# Bare en route for å vise json fil til hvert bord
@app.route('/api/<tablename>')
def api(tablename):
    return generateJSON(tablename)



# Dette er funksjonen som finner hvilket bordoppsett som skal sendes til javascripten som tegner bordet
# Admin og brukeren har forskjellige session verdier for å ikke skape konflikter mellom dem
@app.route('/load/json')
def loadjson():
    if 'user-roomplan' in session:
        return generateJSON(session['user-roomplan'])
    if 'admin-roomplan' in session:
        return generateJSON(session['admin-roomplan'])
    else:
        return generateJSON("basic")

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=80, debug=True) # debug kun i teste fasen
   #app.run(debug=True)