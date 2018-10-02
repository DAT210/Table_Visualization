from flask import Flask
from flask import render_template
from __init__ import app
import json

app = Flask(__name__)

@app.route('/visualize')
def visualize():
    return app.send_static_file("roomPlan.json")

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)0', port=80)