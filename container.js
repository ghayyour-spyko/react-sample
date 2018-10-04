import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createItem, updateItem, selectItem } from '../actions/Editor';
import { getCategory } from '../actions/Category';
import { getProduct } from '../actions/Product';
import { getClipart } from '../actions/Clipart';
import { processImage, processImageWizardModeCompleted, processImageReplace, processImageAbort } from '../actions/File';
import { getUrl } from '../actions/SignedUrl';
import { getFontCategories, getFontsByCategory } from '../actions/FontCategory';


function mapStateToProps ({ designer, routing }) {
    const shirtSide = designer.shirt.present.side;
    const {color} = designer;
    let colorObject = {};

    if (color.color) {
        colorObject = { ...color.color, side: shirtSide, shirtId: color.color.id };
    }

    return {
        selectItem: designer.editor.present.itemsById[designer.editor.present.selectId],
        shirt: designer.products.shirt || designer.shirt.present,
        color: colorObject,
        categories: designer.categories,
        products: designer.products,
        clipart: designer.clipart,
        processedImage: designer.file,
        location: routing.locationBeforeTransitions,
        fonts: designer.fonts,
        defaultFont: (designer.fonts.fonts).find((f) => parseInt(f.id, 0) === designer.fonts.defaultFontId)
    };
}

function mapDispatchToProps (dispatch) {
    return {
        onSelectItem: bindActionCreators(selectItem, dispatch),
        onUpdateItem: bindActionCreators(updateItem, dispatch),
        onCreateItem: bindActionCreators(createItem, dispatch),
        onGetCategories: bindActionCreators(getCategory, dispatch),
        onGetProducts: bindActionCreators(getProduct, dispatch),
        onGetClipart: bindActionCreators(getClipart, dispatch),
        onGetUrl: bindActionCreators(getUrl, dispatch),
        processImage: bindActionCreators(processImage, dispatch),
        onGetFontCategory: bindActionCreators(getFontCategories, dispatch),
        onGetFontsByCategory: bindActionCreators(getFontsByCategory, dispatch),
        processImageWizardModeCompleted: bindActionCreators(processImageWizardModeCompleted, dispatch),
        processImageReplace: bindActionCreators(processImageReplace, dispatch),
        processImageAbort: bindActionCreators(processImageAbort, dispatch),
        dispatch
    };
}

function mergeProps (stateProps, dispatchProps) {
    return {
        ...stateProps,
        ...dispatchProps,
        onCreateItem: bindActionCreators(createItem.bind(null, stateProps.color), dispatchProps.dispatch)
    };
}

export function ToolbarContainer (Toolbar) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toolbar);
}
