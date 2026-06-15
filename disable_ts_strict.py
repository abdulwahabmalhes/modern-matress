with open('tsconfig.app.json', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"noUnusedLocals": true', '"noUnusedLocals": false')
content = content.replace('"noUnusedParameters": true', '"noUnusedParameters": false')

with open('tsconfig.app.json', 'w', encoding='utf-8') as f:
    f.write(content)
