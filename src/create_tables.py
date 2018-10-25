from __init__ import db
from models import Roomplan, Walls


def start_tables():
                    #(id,x,y,width,height,name)
    table1 = Roomplan(1,185,85,60,40,"oslo",2)
    table2 = Roomplan(2, 105, 225,60,40 ,"oslo",2)
    table3 = Roomplan(3, 450, 150,60,40, "oslo",2)
    table4 = Roomplan(4, 250, 50, 90, 40, "oslo",2)
    wall1 =  Walls(1,"oslo", 200, 400, 100, 40)

    db.session.add(wall1)
    db.session.add(table1)
    db.session.add(table2)
    db.session.add(table3)
    db.session.add(table4)

    # commit the changes
    db.session.commit()

