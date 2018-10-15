from __init__ import db

class Roomplan(db.Model):
    __tablename__ = 'roomplan'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, primary_key=True)
    xpos = db.Column(db.Integer)
    ypos = db.Column(db.Integer)
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)


    def __init__(self, id, xpos,ypos,width, height,name):
        self.id = id
        self.xpos = xpos
        self.ypos = ypos
        self.width = width
        self.height = height
        self.name = name


    def __repr__(self):
        return '<title {}'.format(self.name)