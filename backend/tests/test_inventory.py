def test_update_inventory_success(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.rowcount = 1

    # 実行
    response = client.put("/inventory/1", json={"quantity": 50})

    # 検証
    assert response.status_code == 200
    assert response.json() == {"message": "Inventory updated successfully", "inventory_id": 1, "new_quantity": 50}

def test_update_inventory_not_found(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.rowcount = 0

    # 実行
    response = client.put("/inventory/999", json={"quantity": 50})

    # 検証
    assert response.status_code == 404
    assert response.json() == {"detail": "Inventory item not found"}

def test_update_inventory_negative_quantity(client):
    # 実行
    response = client.put("/inventory/1", json={"quantity": -10})

    # 検証
    assert response.status_code == 400
    assert response.json() == {"detail": "Quantity cannot be negative"}

def test_update_batch_inventory_success(client):
    # 準備
    items = [{"id": 1, "quantity": 10}, {"id": 2, "quantity": 20}]

    # 実行
    response = client.put("/inventory/batch", json=items)

    # 検証
    assert response.status_code == 200
    assert response.json() == {"message": "Inventory updated successfully"}
