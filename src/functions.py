from flask import Flask,request, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
from sqlalchemy import update, func



def generateJSON(value):
    # Laster inn alle posisjoner og størrelser på bord fra databasen
    default_value = Roomplan.query.filter_by(name=value)
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



def getRestaurantList():
    restaurant_list = []
    all_restaurants = Roomplan.query.all()
    for restaurant in all_restaurants:
        if restaurant.name in restaurant_list:
            continue
        else:
            restaurant_list.append(restaurant.name)
    return restaurant_list



def newRoomplan(id,xpos,ypos,width,height,name):
    try:
        table = Roomplan(int(id), int(xpos), int(ypos), int(width), int(height), name)
        db.session.add(table)
        db.session.commit()
    except:
        print("Ikke gyldig innparametere")



def returnDatabaseStatus(name):
    roomplan = Roomplan.query.filter_by(name=name).first()
    if len(name) < 1:
        message = {"status": "error","message": "The name is too short"}
        return message
    if roomplan:
        message = {"status": "error","message": "This name does already exist"}
        return message
    return {"status": "success"}
