import React from 'react';
import jacket from '../../assets/images/items/1.jpg';
import shirt from '../../assets/images/items/2.jpg';
import shorts from '../../assets/images/items/3.jpg';
import backpack from '../../assets/images/items/4.jpg';
import wallet from '../../assets/images/items/5.jpg';
import chair1 from '../../assets/images/items/6.jpg';
import watch from '../../assets/images/items/7.jpg';
import chair2 from '../../assets/images/items/7.jpg';

const Apparel = () => {
    return (
        <section className="section-apparel padding-y">
            <div className="container">
                <h3 className="section-title">APPAREL</h3>

                <div className="row">
                    {/* Featured Product */}
                    <div className="col-md-3">
                        <div className="card featured-card">
                            <div className="card-body">
                                <h5 className="card-title">Best trending clothes only for summer</h5>
                                <p className="card-text">Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <a href="#" className="btn btn-outline-primary">Source now</a>
                            </div>
                            <img src={jacket} className="featured-img" alt="Featured" />
                        </div>
                    </div>


                    {/* Product Grid */}
                    <div className="col-md-9">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={shirt} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Well made women clothes with trending collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Suzhou, China</small>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={jacket} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Great clothes with trending collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Beijing, China</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={shorts} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Demo clothes with sample collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Tokyo, Japan</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={backpack} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Home and kitchen electronic stuff collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Tashkent, Uzb</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={wallet} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Home and kitchen electronic stuff collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> London, Britain</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={chair1} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Home and kitchen electronic stuff collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Suzhou, China</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={watch} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Well made clothes with trending collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Hong Kong, China</small>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="product-card">
                                    <img src={chair2} alt="Product" />
                                    <div className="product-info">
                                        <p className="product-title">Home and kitchen interior stuff collection</p>
                                        <small className="location"><i className="fas fa-map-marker-alt"></i> Suzhou, China</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Apparel;