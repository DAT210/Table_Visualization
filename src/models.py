from __init__ import db

class Roomplan(db.Model):
    __tablename__ = 'roomplan'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, primary_key=True)
    xpos = db.Column(db.Integer)
    ypos = db.Column(db.Integer)
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    capacity = db.Column(db.Integer)



    def __init__(self, id, xpos,ypos,width, height,name,capacity):
        self.id = id
        self.xpos = xpos
        self.ypos = ypos
        self.width = width
        self.height = height
        self.name = name
        self.capacity = capacity


    def __repr__(self):
        return '<title {}'.format(self.name)


class Walls(db.Model):
    __tablename__ = 'wall'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, primary_key=True)
    x_start = db.Column(db.Integer)
    x_end = db.Column(db.Integer)
    y_start = db.Column(db.Integer)
    y_end= db.Column(db.Integer)

    def __init__(self, id, name, x_start, x_end, y_start, y_end):
        self.id = id
        self.name = name
        self.x_start = x_start
        self.y_start = y_start
        self.x_end = x_end
        self.y_end = y_end


    def __repr__(self):
        return '<title {}'.format(self.name)
