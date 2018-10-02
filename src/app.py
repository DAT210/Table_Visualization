from flask import Flask
from __init__ import app


@app.route('/')
def hello():
    return "Hello World 2!"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)