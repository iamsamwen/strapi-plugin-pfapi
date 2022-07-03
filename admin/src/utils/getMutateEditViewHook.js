
export default (custom_type) => {

    const mutateLayout = layout => layout.map(row => row.reduce((acc, field) => {

        const isEnabled = field.fieldSchema.pluginOptions?.[custom_type]?.enabled;
    
        if (!isEnabled) return [...acc, field];
    
        return [ ...acc, { ...field, fieldSchema: { ...field.fieldSchema, type: custom_type }} ];
        
    }, []));
    
    return ({ layout, query }) => {
    
        const mutatedEditLayout = mutateLayout(layout.contentType.layouts.edit);
      
        const enhancedLayouts = { ...layout.contentType.layouts, edit: mutatedEditLayout };
    
        return { query, layout: { ...layout, contentType: { ...layout.contentType, layouts: enhancedLayouts }}};
    };
    
}
