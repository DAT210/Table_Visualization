from flask import Flask,request, session, jsonify
from __init__ import app, db
from models import Roomplan, Walls, Tables
import json
from sqlalchemy import update, func


def get_json_setup(value):
        # Laster inn alle posisjoner og størrelser på bord fra databasen
        try:
            roomplan = Roomplan.query.filter_by(name=value).first()
            data = {
                "width": roomplan.width,
                "height": roomplan.height,
                "tables": [],
                "walls": [],
                "name": roomplan.name
            }
            
            for table in roomplan.tables:
                data["tables"].append({
                    "id": table.id,
                    "width": table.width,
                    "height": table.height,
                    "position": {"x": table.xpos, "y": table.ypos},
                    "capacity": table.capacity
                })
            
            for wall in roomplan.walls:
                data["walls"].append({
                    "from": {"x": wall.x_start, "y": wall.y_start},
                    "to": {"x": wall.x_end, "y": wall.y_end}
                })

            return json.dumps(data)
        except:
             data = {
                "width": 700,
                "height": 500,
                "tables": [],
                "walls": []
            }
             return json.dumps(data)


def get_restaurants():
        restaurant_list = []
        all_restaurants = Roomplan.query.all()
        for restaurant in all_restaurants:
            if restaurant.name in restaurant_list:
                continue
            else:
                restaurant_list.append(restaurant.name)
        return restaurant_list




def get_db_status(name, data):
        roomplan = Roomplan.query.filter_by(name=name).first()
        if len(data["tables"]) < 1:
            message = {
                "status": "error",
                "message": "You have to add tables"
            }
            return message
        if (' ' in name) == True:
            message = {
                "status": "error",
                "message": "The name should not contain space"
            }
            return message

        if roomplan:
            message = {
                "status": "error",
                "message": "This name does already exist"
            }
            return message
        return {"status": "success"}
