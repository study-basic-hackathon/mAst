import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def patch_db_pool(monkeypatch):
    """
    テスト中に実際のDB接続が行われるのを防ぐため、MySQLConnectionPoolにパッチを適用します。
    このフィクスチャは、各テストの実行前に自動的に実行されます。
    """
    # database.pyのモジュールレベルでコネクションプールが作成されるのを防ぎます
    monkeypatch.setattr("mysql.connector.pooling.MySQLConnectionPool", MagicMock())

@pytest.fixture
def mock_db_connection():
    """実際のデータベースを必要としない、モックのデータベース接続を提供します。"""
    mock_conn = MagicMock()
    # fetchallやcommitなどの操作のためにカーソルをシミュレートします
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    # `with mock_conn.cursor() as cursor:` のような構文をサポートします
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    return mock_conn

@pytest.fixture
def client(mock_db_connection):
    """
    モック化されたデータベース接続を使用するTestClientフィクスチャ。
    """
    # monkeypatchが有効な状態でインポートされるように、ここでインポートします
    from main import app
    from database import get_db_connection

    # テスト期間中、依存関係をオーバーライドします
    app.dependency_overrides[get_db_connection] = lambda: mock_db_connection
    
    with TestClient(app) as test_client:
        yield test_client
    
    # テスト後にオーバーライドをクリーンアップします
    app.dependency_overrides.clear()
