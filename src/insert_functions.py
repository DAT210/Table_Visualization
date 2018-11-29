from src import db
from src.models import Roomplan, Tables, Walls
from sqlalchemy import update, func


def insert_roomplan(name,data):
    try:
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
            db.session.add(new_wall)
            i += 1
        db.session.commit()
    except:
        return "error"

