from unittest.mock import Mock
from crud import parts as crud_parts

def test_get_all_commits_transaction():
    """
    get_all関数がトランザクションをコミットすることを確認するテスト。
    """
    # 準備: データベース接続のモックを作成
    mock_db = Mock()
    mock_cursor = mock_db.cursor.return_value
    mock_cursor.fetchall.return_value = []  # fetchallの戻り値は空でよい

    # 実行: テスト対象の関数を呼び出す
    crud_parts.get_all(mock_db)

    # 検証: commitメソッドが1回呼び出されたことを確認
    mock_db.commit.assert_called_once()
