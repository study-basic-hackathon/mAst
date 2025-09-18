import os

def test_get_parts_data_success_no_filter(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.fetchall.return_value = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]

    # 実行
    response = client.get("/parts")

    # 検証
    assert response.status_code == 200
    expected_data = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]
    assert response.json() == expected_data
    # crud.get_all が引数なしで呼ばれたことを確認
    mock_db_connection.cursor.return_value.execute.assert_called_with(
        "\n        SELECT\n            p.id,\n            i.id as inventoryId,\n            p.p_name AS title,\n            c.name AS category,\n            i.quantity,\n            COALESCE(p.imageUrl, '') AS imageUrl\n        FROM Parts p\n        JOIN Inventory i ON p.id = i.parts_id\n        JOIN Category c ON p.c_id = c.id\n    ",
        ()
    )

def test_get_parts_data_success_with_name_filter(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.fetchall.return_value = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
    ]
    search_name = "Part A"

    # 実行
    response = client.get(f"/parts?name={search_name}")

    # 検証
    assert response.status_code == 200
    expected_data = [
        {'id': 1, 'inventoryId': 101, 'title': 'Part A', 'category': 'Category A', 'quantity': 10, 'imageUrl': 'http://example.com/a.jpg'},
    ]
    assert response.json() == expected_data
    # crud.get_all が LIKE 句付きのクエリで呼ばれたことを確認
    expected_query = (
        "\n        SELECT\n            p.id,\n            i.id as inventoryId,\n            p.p_name AS title,\n            c.name AS category,\n            i.quantity,\n            COALESCE(p.imageUrl, '') AS imageUrl\n        FROM Parts p\n        JOIN Inventory i ON p.id = i.parts_id\n        JOIN Category c ON p.c_id = c.id\n     WHERE p.p_name LIKE %s"
    )
    mock_db_connection.cursor.return_value.execute.assert_called_with(
        expected_query,
        (f"%{search_name}%",)
    )

def test_get_parts_data_success_with_category_filter(client, mock_db_connection):
    # 準備
    mock_cursor = mock_db_connection.cursor.return_value
    mock_cursor.fetchall.return_value = [
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]
    search_category_id = 2

    # 実行
    response = client.get(f"/parts?category_id={search_category_id}")

    # 検証
    assert response.status_code == 200
    expected_data = [
        {'id': 2, 'inventoryId': 102, 'title': 'Part B', 'category': 'Category B', 'quantity': 20, 'imageUrl': 'http://example.com/b.jpg'},
    ]
    assert response.json() == expected_data
    # crud.get_all が WHERE 句付きのクエリで呼ばれたことを確認
    # (実際のクエリはcrudの実装に依存する)
    # ここでは、executeが正しいパラメータで呼ばれたかを検証する
    args, kwargs = mock_db_connection.cursor.return_value.execute.call_args
    assert "WHERE p.c_id = %s" in args[0]
    assert args[1] == (search_category_id,)

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


def test_upload_part_image_success(client, mock_db_connection, monkeypatch):
    # 準備
    part_id = 1
    file_content = b"test image content"
    file_name = "test_image.jpg"

    # crud.parts.update_image_url が呼び出されることを確認するためのモック
    mock_update_image_url = lambda db, p_id, url: None
    monkeypatch.setattr("crud.parts.update_image_url", mock_update_image_url)

    # ファイル保存関連のos/shutil関数をモック
    original_join = os.path.join
    def mock_join(*args):
        if args[0] == "static" and args[1] == "images":
            return "/tmp/static/images"
        return original_join(*args)
    monkeypatch.setattr("os.path.join", mock_join)
    monkeypatch.setattr("os.makedirs", lambda *args, **kwargs: None)
    monkeypatch.setattr("shutil.copyfileobj", lambda src, dest: None)
    # `open`をモックして、ファイル書き込みをシミュレート
    from unittest.mock import mock_open
    monkeypatch.setattr("builtins.open", mock_open())

    # 実行
    with open(file_name, "wb") as f:
        f.write(file_content)
    
    with open(file_name, "rb") as f:
        response = client.post(
            f"/parts/{part_id}/image",
            files={"file": (file_name, f, "image/jpeg")}
        )

    # 後片付け
    # os.remove(file_name) # openをモックしているので、物理ファイルは作成されない

    # 検証
    assert response.status_code == 200
    # レスポンスの image_url は固定のファイル名に基づいていることを確認
    expected_url = f"/static/images/{part_id}.jpg"
    response_data = response.json()
    assert response_data["message"] == "Image uploaded successfully"
    assert response_data["parts_id"] == part_id
    # APIの実装に合わせて、ファイル名が part_id に基づいていることを確認
    file_extension = os.path.splitext(file_name)[1]
    expected_file_name = f"{part_id}{file_extension}"
    assert expected_file_name in response_data["image_url"]
