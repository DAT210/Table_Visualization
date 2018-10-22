from flask import Flask,request, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
from sqlalchemy import update, func
from insert_functions import insert_roomplan




def update_roomplan(name, data):
        deleted_rows = Roomplan.query.filter_by(name=name)
        try:
            deleted_rows.delete()
            db.session.commit()
            insert_roomplan(name,data)
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
