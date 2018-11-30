from src import db
from src.models import Roomplan, Walls, Tables


def start_tables():
                    #(id,x,y,width,height,name)
    roomplan = Roomplan("oslo")                
    table1 = Tables(1,350,230,60,40,"oslo",2)
    table2 = Tables(2, 350, 150,60,40 ,"oslo",2)
    table3 = Tables(3, 490, 150,60,40, "oslo",2)
    table4 = Tables(4, 450, 250, 90, 40, "oslo",2)
    wall1 =  Walls(1,"oslo", 200, 600, 100, 100)
    wall2 =  Walls(2,"oslo", 600, 600, 100, 400)
    wall3 =  Walls(3,"oslo", 600, 300, 400, 400)
    wall4 =  Walls(4,"oslo", 300, 300, 400, 300)
    wall5 =  Walls(5,"oslo", 300, 200, 300, 300)
    wall6 =  Walls(6,"oslo", 200, 200, 300, 100)

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
    # commit the changes
    db.session.commit()

