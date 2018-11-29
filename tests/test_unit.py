from src.get_functions import *
from src.insert_functions import *
from src.update_functions import *
from src.delete_functions import *
import json
import pytest

test_data = {
    "width": 100,
    "height": 200,
    "tables": [{"id": 1, "width": 60, "height": 40, "position": {"x": 185, "y": 85}, "capacity": 2}],
    "walls": [{"from": {"x": 200, "y": 100}, "to": {"x": 600, "y": 100}}],
    "name": "test",
}

update_data = {
    "width": 100,
    "height": 200,
    "tables": [{"id": 1, "width": 62, "height": 42, "position": {"x": 182, "y": 82}, "capacity": 2},
               {"id": 2, "width": 160, "height": 140, "position": {"x": 285, "y":185}, "capacity": 4}],
    "walls": [{"from": {"x": 100, "y": 20}, "to": {"x": 10, "y": 30}}],
    "name": "test",
}

empty_data = {
    "width":  100,
    "height": 100,
    "tables": [],
    "walls": [],
    "name": "wrong"
}

@pytest.mark.order1
def test_insert_roomplan():
    status = insert_roomplan("test", test_data)
    assert status != "error"
   
    
@pytest.mark.order2
def test_get_json_setup():
    data = json.loads(get_json_setup("test"))
    name = data["name"]
    for table in data["tables"]:
        id = table["id"]
        xpos = table["position"]['x']
        ypos = table["position"]['y']
        width = table["width"]
        height = table["height"]
        capacity = table["capacity"]
        break    
    assert name == "test"
    assert id == 1
    assert xpos == 185
    assert ypos == 85
    assert width == 60
    assert height == 40
    assert capacity == 2



@pytest.mark.order3
def test_get_db_status():
    data = json.loads(get_json_setup("test"))
    space_input = get_db_status("name with space ", data )
    assert space_input == {'message': 'The name should not contain space', 'status': 'error'}
    existing_input = get_db_status("test", data )
    assert existing_input == {'message': 'This name does already exist', 'status': 'error'}
    short_input = get_db_status("test", empty_data)
    assert short_input == {'message': 'You have to add tables', 'status': 'error'}


@pytest.mark.order4
def test_update_roomplan():
    status = update_roomplan("test",update_data)
    assert status == '{"status": "success", "message": "Successfully added to database"}'
    data = json.loads(get_json_setup("test"))
    name = data["name"]
    for table in data["tables"]:
        id = table["id"]
        xpos = table["position"]['x']
        ypos = table["position"]['y']
        width = table["width"]
        height = table["height"]
        capacity = table["capacity"]
        break    
    assert name == "test"
    assert id == 1
    assert xpos == 182
    assert ypos == 82
    assert width == 62
    assert height == 42
    assert capacity == 2


@pytest.mark.order5
def test_teardown():
    delete_roomplan("test")
    