from flask import Flask,request, session, jsonify
from __init__ import app, db
from models import Roomplan, Walls
import json
from sqlalchemy import update, func



def get_json_setup(value):
        # Last inn json filen vår som tegner selve rommet med vegger
        with open('static/roomPlan.json') as f:
            data = json.load(f)


        # Laster inn alle posisjoner og størrelser på bord fra databasen
        table_values = Roomplan.query.filter_by(name=value)
        table_positions = {}

        # Sett inn hvor bord skal være i json fila
        draw_tables = data["tables"]
        if table_values:
            for tables in table_values:
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


        walls = Walls.query.filter_by(name=value)
        wall_positions = {}
        draw_walls = data["walls"]
        if walls:
            for wall in walls:
                id = wall.id
                x_start = wall.x_start
                x_end = wall.x_end
                y_start = wall.y_start
                y_end = wall.y_end
                wall_positions[id] = {
                    "from": {"x": x_start, "y": y_start},
                    "to": {"x": x_end, "y": y_end}

                }
                draw_walls.append(wall_positions[id])


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




def get_db_status(name):
        roomplan = Roomplan.query.filter_by(name=name).first()
        if len(name) < 1:
            message = {
                "status": "error",
                "message": "The name is too short"
            }
            return message
        if roomplan:
            message = {
                "status": "error",
                "message": "This name does already exist"
            }
            return message
        return {"status": "success"}
