from flask import Flask, render_template, Blueprint, request, redirect, url_for, flash, session, jsonify
from __init__ import app, db
from models import Roomplan
import json
from sqlalchemy import update, func
import requests


@app.route('/visualize')
def visualize():
    # Laster inn default
    default_value = Roomplan.query.filter_by(name="default")
    table_positions = {}

   # Last inn json filen vår med standard på bordet
    with open('static/roomPlan.json') as f:
        data = json.load(f)

   # Dette genererer en json fil som tegner hvor bord er og størrelse på de
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

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run()