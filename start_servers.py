import subprocess
import threading
import os
import sys
import time

def read_output(process, prefix, color_code):
    for line in iter(process.stdout.readline, b''):
        try:
            line_str = line.decode('utf-8').strip()
            if line_str:
                print(f"\033[{color_code}m{prefix}\033[0m: {line_str}")
        except:
            pass
    process.stdout.close()

def run_service(command, cwd, prefix, color):
    print(f"Starting {prefix} with command: {command} in {cwd}")
    
    # Use shell=True for Windows commands like 'npm' or 'mvn' to work properly
    proc = subprocess.Popen(
        command,
        cwd=cwd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,  # Merge stderr into stdout
        bufsize=1
    )
    
    t = threading.Thread(target=read_output, args=(proc, prefix, color))
    t.daemon = True
    t.start()
    return proc

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Colors: 92=Green, 94=Blue, 95=Magenta
    procs = []

    try:
        # 1. AI Engine
        ai_cmd = "pip install -r requirements.txt && python main.py"
        ai_proc = run_service(ai_cmd, os.path.join(root_dir, "ai_engine"), "[AI_ENGINE]", "94")
        procs.append(ai_proc)

        # 2. Frontend
        fe_cmd = "npm run dev"
        fe_proc = run_service(fe_cmd, os.path.join(root_dir, "frontend"), "[FRONTEND ]", "92")
        procs.append(fe_proc)

        # 3. Backend (Check for mvnw)
        backend_dir = os.path.join(root_dir, "backend")
        mvn_cmd = "mvn spring-boot:run"
        if os.path.exists(os.path.join(backend_dir, "mvnw.cmd")):
             mvn_cmd = "mvnw.cmd spring-boot:run" # Use wrapper if available
             
        be_proc = run_service(mvn_cmd, backend_dir, "[BACKEND  ]", "95")
        procs.append(be_proc)

        print("\nAll services attempted. Logs will appear below.\nPress Ctrl+C to stop.\n")
        
        # Keep main thread alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopping services...")
        for p in procs:
            p.terminate()  # Sends SigTerm
        # On Windows terminate() might not be enough for shell=True, ideally we'd use taskkill
        # But for this simple script, it's okay for now.

if __name__ == "__main__":
    main()
