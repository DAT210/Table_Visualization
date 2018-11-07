from __init__ import db
from models import Roomplan, Walls, Tables


def start_tables():
                    #(id,x,y,width,height,name)
    roomplan = Roomplan("oslo")                
    table1 = Tables(1,185,85,60,40,"oslo",2)
    table2 = Tables(2, 105, 225,60,40 ,"oslo",2)
    table3 = Tables(3, 450, 150,60,40, "oslo",2)
    table4 = Tables(4, 250, 50, 90, 40, "oslo",2)
    bergen = Roomplan("bergen")                
    tablebergen = Tables(1,185,85,60,40,"bergen",2)
    wall1 =  Walls(1,"oslo", 200, 600, 100, 100)
    wall2 =  Walls(2,"oslo", 600, 600, 100, 400)
    wall3 =  Walls(3,"oslo", 600, 300, 400, 400)
    wall4 =  Walls(4,"oslo", 300, 300, 400, 300)
    wall5 =  Walls(5,"oslo", 300, 200, 300, 300)
    wall6 =  Walls(6,"oslo", 200, 200, 300, 100)
    wallb1 =  Walls(1,"bergen", 100, 200, 100, 100)
    wallb2 =  Walls(2,"bergen", 200, 200, 100, 200)
    wallb3 =  Walls(3,"bergen", 200, 100, 200, 200)
    wallb4 =  Walls(4,"bergen", 100, 100, 200, 100)

    db.session.add(wall1)
    db.session.add(wall2)
    db.session.add(wall3)
    db.session.add(wall4)
    db.session.add(wall5)
    db.session.add(wall6)
    db.session.add(table1)
    db.session.add(table2)
    db.session.add(table3)
    db.session.add(table4)
    db.session.add(roomplan)
    db.session.add(bergen)
    db.session.add(tablebergen)
    db.session.add(wallb1)
    db.session.add(wallb2)
    db.session.add(wallb3)
    db.session.add(wallb4)
    # commit the changes
    db.session.commit()

