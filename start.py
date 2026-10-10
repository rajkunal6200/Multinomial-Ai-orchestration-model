import subprocess
import sys
import signal
import time

def main():
    print("Starting FastAPI backend on port 8001...")
    fastapi_proc = subprocess.Popen([
        "python3", "-m", "uvicorn", "api.main:app",
        "--host", "127.0.0.1",
        "--port", "8001"
    ])

    time.sleep(1)

    print("Starting React (Vite) frontend on port 3000...")
    vite_proc = subprocess.Popen([
        "npx", "vite", "--port=3000", "--host=0.0.0.0"
    ])

    def cleanup(sig, frame):
        print("\nShutting down servers...")
        try:
            fastapi_proc.terminate()
        except Exception:
            pass
        try:
            vite_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        vite_proc.wait()
    except KeyboardInterrupt:
        cleanup(None, None)
    finally:
        try:
            fastapi_proc.terminate()
        except Exception:
            pass

if __name__ == "__main__":
    main()
