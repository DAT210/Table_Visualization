from flask import Flask,request, session, jsonify
from __init__ import app, db
from models import Roomplan, Walls, Tables
import json
from sqlalchemy import update, func
from insert_functions import insert_roomplan


def update_roomplan(name, data):
    roomplan = Roomplan.query.filter_by(name=name).first()
    try:
        db.session.delete(roomplan)
        table = Roomplan(name)
        db.session.add(table)
        for key in data['tables']:
            id = key["id"]
            xpos = key["position"]['x']
            ypos = key["position"]['y']
            width = key["width"]
            height = key["height"]
            capacity = key["capacity"]
            table = Tables(id,xpos,ypos,width,height,name,capacity)
            db.session.add(table)
        i = 1
        for wall in data['walls']:
            x_start = wall["from"]['x']
            x_end = wall["to"]['x']
            y_start = wall["from"]['y']
            y_end = wall["to"]['y']
            new_wall = Walls(i,name,x_start,x_end,y_start,y_end)
            i += 1
            db.session.add(new_wall)
        db.session.commit()
        message = {
            "status": "success",
            "message": "Successfully added to database"
        }
        return json.dumps(message)
    except:
        return json.dumps({
            "status": "error",
            "message": "Could not update this restaurant"
        })
