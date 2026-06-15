const fs = require('fs');

let content = fs.readFileSync('src/AdminApp_new.tsx', 'utf8');

if (!content.includes('AddProductForm')) {
    content = content.replace('import { \n  Landmark', "import { AddProductForm } from './components/AddProductForm';\nimport { \n  Landmark");
}

const startMarker = "{/* --- TAB: PRODUCTS CRUD CATALOG --- */}";
const startIdx = content.indexOf(startMarker);

if (startIdx > -1) {
    const activeTabStart = content.indexOf("{activeTab === 'products' && (", startIdx);
    if (activeTabStart > -1) {
        let braceCount = 0;
        let started = false;
        let endIdx = -1;
        
        for (let i = activeTabStart; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '(') braceCount++;
            if (content[i] === '}') braceCount--;
            if (content[i] === ')') braceCount--;
            
            if (braceCount > 0) started = true;
            if (started && braceCount === 0) {
                endIdx = i;
                break;
            }
        }
        
        if (endIdx > -1) {
            const newTabContent = `{activeTab === 'products' && (
            <div className="animate-fadeIn">
              <AddProductForm />
            </div>
          )}`;
            content = content.substring(0, activeTabStart) + newTabContent + content.substring(endIdx + 1);
        }
    }
}

fs.writeFileSync('src/AdminApp.tsx', content, 'utf8');
console.log('Done replacement');
