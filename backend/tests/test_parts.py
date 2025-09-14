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

def test_create_part_success(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    # crud.createの戻り値をモック
    mock_created_part = {
        'id': 123,
        'inventoryId': 201,
        'title': 'New Part',
        'category': 'New Category',
        'quantity': 10,
        'imageUrl': ''
    }
    # crud.parts.create をモックする方がより堅牢ですが、ここではカーソルの振る舞いをモックします
    mock_cursor.fetchone.return_value = mock_created_part
    mock_cursor.lastrowid = 123

    new_part_data = {"title": "New Part", "category_id": "1", "quantity": "10"}

    # 実行
    # APIはフォームデータを期待しているので、json=ではなくdata=を使用
    response = client.post("/parts", data=new_part_data)

    # 検証
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["id"] == 123
    assert response_data["title"] == new_part_data["title"]
    assert response_data["quantity"] == int(new_part_data["quantity"])
    # crud.createのモックの戻り値に基づいて検証を調整
    assert response_data["category"] == mock_created_part["category"]
