from flask import session
from __init__ import app, db
from models import Roomplan, Walls, Tables


def delete_roomplan(name):
    roomplan = Roomplan.query.filter_by(name=name).first()
    try:
        db.session.delete(roomplan)
        db.session.commit()
        session.clear()
        return "success"
    except:
        return "error"