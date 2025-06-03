from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Hello, world!')

def run_server():
    server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
    print("9. Сервер запущен на http://localhost:8000")
    server.serve_forever()

# Запуск сервера в отдельном потоке
server_thread = threading.Thread(target=run_server)
server_thread.daemon = True
server_thread.start()
