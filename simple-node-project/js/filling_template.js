exports.filling_template=(el,section_template)=>{
let updated_section_template=section_template.replace(/{@image@}/g,el.image);
updated_section_template=updated_section_template.replace(/{@id@}/g,el.id);
updated_section_template=updated_section_template.replace(/{@moviename@}/g,el.moviename);
updated_section_template=updated_section_template.replace(/{@moral@}/g,el.moral);
updated_section_template=updated_section_template.replace(/{@review@}/g,el.review);
updated_section_template=updated_section_template.replace(/{@actors@}/g,el.actors);
return updated_section_template;
}
// ----------------------------------replacing-all-the-template-with-data-----------------------------