from project import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)


    def __init__(self, id, name):
        self.id = id
        self.name = name


    def __repr__(self):
        return '<title {}'.format(self.name)