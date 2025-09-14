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
    # 1. create_part -> crud_parts.create が呼ばれる
    # 2. crud_parts.create は inventory と parts を作成し、IDを返す
    # このテストでは、crud関数が返す完全なPartオブジェクトをモックするのではなく、
    # APIが正しいデータで呼び出され、成功ステータスを返すことを確認します。
    # crud.createの戻り値をモックする方がより正確ですが、現在のテスト構造に合わせて調整します。
    mock_cursor.fetchone.return_value = (1, 'New Category') # (c_id, c_name)
    mock_cursor.lastrowid = 123 # 新しく作成された部品のID

    new_part_data = {"title": "New Part", "category_id": 1, "quantity": 10}

    # 実行
    response = client.post("/parts", json=new_part_data)

    # 検証
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["id"] == 123
    assert response_data["title"] == new_part_data["title"]
    assert response_data["category"] == "New Category" # IDではなく名前が返されることを期待
    assert response_data["quantity"] == new_part_data["quantity"]
