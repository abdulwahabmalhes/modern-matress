const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

const replacements = [
  { search: /text-slate-100/g, replace: 'text-slate-800' },
  { search: /text-slate-200/g, replace: 'text-slate-900' },
  { search: /text-slate-300/g, replace: 'text-slate-700' },
  { search: /text-slate-400/g, replace: 'text-slate-500' },
  { search: /text-gray-400/g, replace: 'text-gray-500' },
  { search: /text-gray-500/g, replace: 'text-gray-500' },
  { search: /text-white/g, replace: 'text-dark' }, // mostly good, except buttons
  { search: /bg-\[#0a0f1d\]\/85/g, replace: 'bg-white' },
  { search: /bg-\[#0a0f1d\]\/60/g, replace: 'bg-white' },
  { search: /bg-\[#0b0f19\]/g, replace: 'bg-gray-50' },
  { search: /bg-slate-900\/40/g, replace: 'bg-white' },
  { search: /bg-slate-900\/50/g, replace: 'bg-gray-50' },
  { search: /bg-dark\/50/g, replace: 'bg-gray-100' },
  { search: /bg-dark\/60/g, replace: 'bg-black/60' }, // keep image overlays dark
  { search: /bg-dark/g, replace: 'bg-white' },
  { search: /bg-white\/5/g, replace: 'bg-gray-50' },
  { search: /bg-white\/\[0\.02\]/g, replace: 'bg-gray-50' },
  { search: /border-white\/5/g, replace: 'border-gray-200' },
  { search: /border-white\/10/g, replace: 'border-gray-200' },
  { search: /border-white\/20/g, replace: 'border-gray-300' },
  { search: /shadow-2xl/g, replace: 'shadow-lg border border-gray-100' },
  { search: /radial-gradient\(at top right, rgba\(107, 12, 34, 0\.12\), transparent 45%\), radial-gradient\(at bottom left, rgba\(43, 59, 112, 0\.12\), transparent 45%\), #070913/g, replace: '#f4f7fb' },
  { search: /fill="#ffffff"/g, replace: 'fill="#1e293b"' }, // SVG
];

let newContent = content;
replacements.forEach(({ search, replace }) => {
  newContent = newContent.replace(search, replace);
});

// For buttons that were bg-primary text-dark (because of text-white -> text-dark), revert them to text-white
newContent = newContent.replace(/text-dark text-xs font-extrabold/g, 'text-white text-xs font-extrabold');
newContent = newContent.replace(/text-dark font-extrabold/g, 'text-white font-extrabold');
newContent = newContent.replace(/text-dark font-bold/g, 'text-white font-bold');
newContent = newContent.replace(/hover:text-dark hover:bg-cream\/40/g, 'hover:text-primary hover:bg-cream/40');


// Now replace the "Products" tab content.
// We need to inject <AddProductForm /> in place of the custom form in the 'products' tab.
// Find the block:
// {/* --- TAB: PRODUCTS CRUD CATALOG --- */}
// {activeTab === 'products' && (
//   <div className="space-y-8 animate-fadeIn">
// ...
//   </div>
// )}
// Note: We'll do it cautiously.

fs.writeFileSync('src/AdminApp_new.tsx', newContent, 'utf8');
console.log('Done mapping styles.');
