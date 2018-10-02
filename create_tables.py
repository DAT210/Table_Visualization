from project import db
from project.models import User


def start_tables():
    # insert user data
    user1 = User(1, "Eirik")
    user2 = User(2, "Per")
    user3 = User(3, "Ola")
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)

    # commit the changes
    db.session.commit()

