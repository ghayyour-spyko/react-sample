import React from 'react';
import PropTypes from 'prop-types';
import { goBack, push } from 'react-router-redux';

import { getProduct } from '../../actions/Product';
import CategoriesNav from './CategoriesNav';
import SubCategoriesNav from './SubCategoriesNav';
import ItemsGrid from './ItemsGrid';

import UILoader from '../Loader';

import './ProductChooser.scss';

export default class ProductChooser extends React.PureComponent {

    static get defaultProps () {
        return {
            categories: null,
            allProducts: null
        };
    }

    static get propTypes () {
        return {
            dispatch: PropTypes.func.isRequired,
            location: PropTypes.object.isRequired,
            subtab: PropTypes.string.isRequired,
            categories: PropTypes.any,
            allProducts: PropTypes.any
        };
    }

    constructor (props) {
        super(props);

        // this will be passed down from the lambda service and is a mock data
        this.state = {
            gridName: 'Change Product',
            categoryName: '',
            subCatId: '',
            isLoading: false,
            mobileView: false,
            defaultCategory: false,
            defaultSubCat: false,
            activeCat: '',
            activeSub: ''
        };

        this.changeSubCategory = this.changeSubCategoryHandler.bind(this);
        this.adjustView = this.adjustView.bind(this);
    }

    componentWillMount () {
        this.adjustView();
        window.addEventListener('customResize', this.adjustView);
    }

    componentWillUnmount () {
        window.removeEventListener('customResize', this.adjustView);
    }

    adjustView () {
        const windowWidth = $(window).width();

        this.setState({ mobileView: windowWidth < 768 });
    }

    getNewLocation (tab, subTab) {
        const { dispatch } = this.props;
        const { location } = this.props;
        const newLocation = {
            ...location,
            query: {
                tab: tab,
                subtab: subTab
            },
            state: { location }
        };

        dispatch(push(newLocation));
    }

    changeCategory (obj) {
        this.setState({
            categoryName: obj
        });

        if (this.state.mobileView) {
            this.getNewLocation('product', 'category');
        } else {
            this.setState({
                defaultCategory: true,
                activeCat: obj
            });
        }
    }

    changeSubCategoryHandler (id) {
        const catId = parseInt(id, 0);
        const { dispatch } = this.props;

        this.setState({ isLoading: true, defaultSubCat: true, activeSub: id}, () => {
            getProduct(catId).then((data) => {
                this.setState({ isLoading: false }, () => dispatch(data));
            })
            .catch(dispatch);
            this.setState({subCatId: id});
        });

        if (this.state.mobileView) {
            this.getNewLocation('product', 'item');
        }
    }

    goBack () {
        const { dispatch } = this.props;

        dispatch(goBack());
    }

    renderDesktopView () {
        const { categoryName, subCatId, mobileView, isLoading, activeCat, activeSub } = this.state;

        const desktopLayout = (
            <div className='grid-container'>
                <section className='product-header'>
                    <button className='btn btn-default btn-md product-btn' onClick={this.goBack.bind(this)}>Back</button>
                    <h3> { this.state.gridName } </h3>
                </section>
                <section >
                    <CategoriesNav active={activeCat} mobileView={mobileView} categories={this.props.categories} onChangeCategory={this.changeCategory.bind(this)} defaultCat={this.state.defaultCategory} />
                    <div className='col-lg-12 col-md-12 col-sm-12 no-padding'>
                        <div className='col-lg-3 col-md-3 col-sm-3 no-padding'>
                            <SubCategoriesNav active={activeSub} mobileView={mobileView} category={categoryName} subCategories={this.props.categories} defaultSubcat={this.state.defaultSubCat} onChangeSubCategory={this.changeSubCategory} />
                        </div>
                        <div className='product-panel col-lg-9 col-md-9 col-sm-9'>
                            <ItemsGrid isLoading={isLoading} mobileView={mobileView} id={subCatId} {...this.props} allProducts={this.props.allProducts} />
                        </div>
                    </div>
                </section>
            </div>
        );

        return desktopLayout;
    }

    renderMobileView () {
        const { subtab } = this.props;
        const { categoryName, subCatId, mobileView } = this.state;

        const mobileLayout = (
            <div className='grid-container'>
                <div className='col-xs-12 col-md-12 col-sm-12'>
                    <section className='product-header'>
                        <button className='btn btn-default btn-md product-btn' onClick={this.goBack.bind(this)}>Back</button>
                        <h3> { this.state.gridName } </h3>
                    </section>
                    { subtab === 'change' ? (
                        <CategoriesNav mobileView={mobileView} categories={this.props.categories} onChangeCategory={this.changeCategory.bind(this)} />
                    ) : (
                        <div className='gridBody'>
                            { subtab === 'category' ? (
                                <SubCategoriesNav mobileView={mobileView} category={categoryName} subCategories={this.props.categories} onChangeSubCategory={this.changeSubCategory} />
                            ) : (
                                <div className='itemsList'>
                                    <ItemsGrid mobileView={mobileView} id={subCatId} {...this.props} />
                                </div>
                                )
                            }
                        </div>
                        )
                    }
                </div>
            </div>
        );

        return mobileLayout;
    }

    render () {
        let child = null;
        const { isLoading, mobileView } = this.state;

        if (mobileView) {
            child = this.renderMobileView();

            return <UILoader isLoading={isLoading}>{child}</UILoader>;
        }

        return this.renderDesktopView(this.props);
    }
}
