import json
import sys
import os

backup_path = r'F:\project\jcerp\new-project\src\views\product\settings\index.vue.bak'
target_path = r'F:\project\jcerp\new-project\src\views\product\settings\index.vue'

try:
    print(f"Reading from {backup_path}")
    with open(backup_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Extracted {len(data['output'])} characters")
    
    with open(target_path, 'w', encoding='utf-8', newline='') as f2:
        f2.write(data['output'])
    
    print('Successfully wrote to index.vue')
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
