from __init__ import db
from models import Roomplan


def start_tables():
    # insert user data
    table1 = Roomplan(1,185,85,60,40,"default")
    table2 = Roomplan(2, 105, 225,60,40 ,"default")
    table3 = Roomplan(3, 450, 150,60,40, "default")
    table4 = Roomplan(4, 250, 50, 90, 40, "default")


    db.session.add(table1)
    db.session.add(table2)
    db.session.add(table3)
    db.session.add(table4)

    # commit the changes
    db.session.commit()

