def test_get_parts_data_success(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    # crud/parts.pyはdictionary=Trueのカーソルから辞書のリストを受け取ることを想定しています
    mock_cursor.fetchall.return_value = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]

    # 実行
    response = client.get("/parts")

    # 検証
    assert response.status_code == 200
    # レスポンスはPartスキーマと一致する必要があります
    expected_data = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]
    assert response.json() == expected_data

def test_delete_part_success(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.rowcount = 1

    # 実行
    response = client.delete("/parts/1")

    # 検証
    assert response.status_code == 200
    assert response.json() == {"message": "Part deleted successfully", "parts_id": 1}

def test_delete_part_not_found(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.rowcount = 0

    # 実行
    response = client.delete("/parts/999")

    # 検証
    assert response.status_code == 404
    assert response.json() == {"detail": "Part not found"}
