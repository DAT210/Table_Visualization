from flask import Flask, render_template, Blueprint, request, redirect, url_for, flash, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
from sqlalchemy import update, func
import requests

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/table/<tablename>')
def table(tablename):
    return render_template("index.html")

######################################################################
############ Default bord blir generert når denne kalles #############
######################################################################
@app.route('/visualize')
def visualize():
    # Laster inn hvordan rommet ser ut by default fra databasen
    default_value = Roomplan.query.filter_by(name="default")
    table_positions = {}

   # Last inn json filen vår som tegner selve rommet med vegger
    with open('src/static/roomPlan.json') as f:
        data = json.load(f)

   # Sett inn hvor bord skal være i json fila
    draw_tables = data["tables"]
    if default_value:
        for tables in default_value:
            id = tables.id
            xpos = tables.xpos
            ypos = tables.ypos
            width = tables.width
            height = tables.height
            table_positions[id] = {
                "id": id,
                "width": width,
                "height": height,
                "position": {"x": xpos, "y": ypos}
            }
            draw_tables.append(table_positions[id])
    return json.dumps(data)


##############################################################################
############ Alle alternative bord blir generert om denne kalles #############
##############################################################################
@app.route('/othertables/<tablename>')
def others(tablename):
    default_value = Roomplan.query.filter_by(name=tablename)
    table_positions = {}
    ## Om det finnes et bordoppsett med innparameteren som er sendt inn, generer det
    if default_value:
        with open('src/static/roomPlan.json') as f:
            data = json.load(f)

        draw_tables = data["tables"]
        for tables in default_value:
            id = tables.id
            xpos = tables.xpos
            ypos = tables.ypos
            width = tables.width
            height = tables.height
            table_positions[id] = {
                "id": id,
                "width": width,
                "height": height,
                "position": {"x": xpos, "y": ypos}
            }
            draw_tables.append(table_positions[id])
        return json.dumps(data)
    else:
        return render_template("admin.html")


######################################
############ AJAX routes #############
######################################

@app.route('/newroom', methods=['POST'])
def test():
    if request.method == 'POST':
        data = request.get_json()
        for key in data:
            id = key["id"]
            xpos = key["xpos"]
            ypos = key["ypos"]
            width = key["width"]
            height = key["height"]
            name = key["name"].lower()
            if len(name) < 1:
                return json.dumps("error")
            try:
                table = Roomplan(int(id), int(xpos), int(ypos), int(width), int(height), name)
                db.session.add(table)
                db.session.commit()
            except:
                print("Ikke gyldig innparametere")
        return json.dumps("success")
    return json.dumps("error")



########################################################################################
############ Admin route brukes til å slette bordoppsett og andre oppgaver #############
########################################################################################

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    ### Hvis noen sletter et bordoppsett
    if request.method == 'POST':
        if request.form['submit_button'] == 'Delete table layout':
            deleted_table = request.form.get("deletedname")
            deleted_rows = Roomplan.query.filter_by(name=deleted_table)
            try:
                deleted_rows.delete()
                db.session.commit()
            except:
                print("klarte ikke slette")
        return render_template("admin.html")
    else:
        return render_template("admin.html")




if __name__ == '__main__':
   app.run(host='0.0.0.0', port=80, debug=True) # debug kun i teste fasen
   #app.run(debug=True)