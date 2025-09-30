#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

PORT = 8000

class ReloadHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(('.html', '.css', '.js')):
            print(f"File changed: {event.src_path}")
            print("Refresh your browser to see changes!")

def start_server():
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Set up file watcher
    event_handler = ReloadHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=True)
    observer.start()
    
    # Start HTTP server
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print("📁 Serving files from:", os.getcwd())
        print("👀 Watching for file changes...")
        print("⏹️  Press Ctrl+C to stop")
        
        # Open browser
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            observer.stop()
            print("\n🛑 Server stopped")
    
    observer.join()

if __name__ == "__main__":
    start_server()