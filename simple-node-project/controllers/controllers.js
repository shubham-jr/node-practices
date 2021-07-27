// -----------------------------------requiring-files-------------------------------------------

const filling_template_obj=require('./../js/filling_template.js');

const reading_files=require('./../js/reading_file.js');

// ---------------------replacing-the-template-to-actual-data--------------------------------

exports.replace_template=(req,res)=>{
const template_filled=reading_files.dataobj.map(el=>filling_template_obj.filling_template(el,reading_files.template_data)).join();
const main=reading_files.index_data.replace('{@section_template@}',template_filled);
res.end(main);
}