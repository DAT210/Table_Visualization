from __init__ import db
from models import Roomplan, Tables
from sqlalchemy import update, func




def insert_roomplan(name,data):
    for key in data:
        id = key["id"]
        xpos = key["xpos"]
        ypos = key["ypos"]
        width = key["width"]
        height = key["height"]
        try:
            table = Roomplan(int(id), int(xpos), int(ypos), int(width), int(height), name)
            db.session.add(table)
            db.session.commit()
        except:
            print("Ikke gyldig innparametere")


