const fs=require('fs');
exports.api_data=fs.readFileSync('./data/api.json','utf-8');
exports.template_data=fs.readFileSync('./public/section_template.html','utf-8'); 
exports.index_data=fs.readFileSync('./public/index_template.html','utf-8');
exports.dataobj=JSON.parse(fs.readFileSync('./data/api.json','utf-8'));
// --------------reading-all-the-files-and-exporting-it------------------------------------------