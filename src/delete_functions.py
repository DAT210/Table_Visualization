from flask import session
from src import app, db
from src.models import Roomplan, Walls, Tables
from sqlalchemy import update, func


def delete_roomplan(name):
    roomplan = Roomplan.query.filter_by(name=name).first()
    try:
        db.session.delete(roomplan)
        db.session.commit()
        session.clear()
        return "success"
    except:
        return "error"