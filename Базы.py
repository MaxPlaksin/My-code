import sqlite3

def sqlite_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
    cursor.execute("INSERT INTO users (name) VALUES ('Alice')")
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()
    conn.close()
    return result

# Пример:
print("13. Результат SQLite запроса:", sqlite_example())


