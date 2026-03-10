#!/usr/bin/env python3
"""SPA-aware dev server: serves index.html for routes that don't match real files."""
import http.server
import os

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_GET(self):
        # If the path maps to a real file, serve it normally
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            return super().do_GET()
        # Otherwise serve index.html (let client-side router handle it)
        self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    with http.server.HTTPServer(("", PORT), SPAHandler) as s:
        print(f"SPA server on http://localhost:{PORT}")
        s.serve_forever()
