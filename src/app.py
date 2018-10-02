from flask import Flask
from __init__ import app
import json

app = Flask(__name__)

@app.route('/visualize')
def visualize():

    roomPlan = {
    "width": 700,
    "height": 500,
    "tables": [
        { "width": 10, "height": 6, "position": {"x": 1, "y": 6} },
        { "width": 10, "height": 6, "position": {"x": 26, "y": 76} },
        { "width": 10, "height": 6, "position": {"x": 43, "y": 50} }
    ],
    "walls": [
        { 
            "from": { "x": 5, "y":5 },
            "to": { "x": 85, "y":5 }
        },
        { 
            "from": { "x": 85, "y":5 },
            "to": { "x": 85, "y":90 }
        },
        { 
            "from": { "x": 85, "y":90 },
            "to": { "x": 5, "y":90 }
        },
        { 
            "from": { "x": 5, "y":90 },
            "to": { "x": 5, "y":5 }
        }
    ]
}
    return json.dumps(roomPlan)

@app.route('/')
def index():
    return app.send_static_file("index1.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)