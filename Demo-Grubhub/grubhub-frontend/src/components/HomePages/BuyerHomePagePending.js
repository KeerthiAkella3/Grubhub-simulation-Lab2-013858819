import React, { Component } from 'react'
import './BuyerLandingPage.css'

export class BuyerHomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        // console.log(this.props);
        return (
            <div>
                <ghs-site-container ng-version="1999.12.31">
                    <ghs-app>
                        <ghs-app-content className>
                            <div className="display:none;">
                                <cb-icon-provider>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    </svg>


                                </cb-icon-provider>
                            </div>
                            <a id="scroll-top" className="scroll-top"></a>
                            <ghs-keep-scroll-position></ghs-keep-scroll-position>

                            <div className="mainNav">
                                <ghs-main-nav role="navigation" aria-label="Main Navigation" className="ghs-mainNav mainNav u-dimension-2 ghWhiteNav">
                                <div at-nav-logo="true" className="mainNavCol mainNavBrand signedIn">
                                        <a title="GRUBHUB" className="mainNavBrand-logo" />
                                    </div>
                                    <div at-main-nav-height="true" className="mainNavCol mainNavSearch"></div>
                                    <div className="mainNavCol mainNavCatering u-hidden-md--down">
                                        <button type="button" className="mainNavBtn mainNav-transition u-clickable caption u-inset-3 u-rounded u-text-secondary mainNavBtn-catering">
                                            <span>Catering</span>
                                        </button>
                                    </div>
                                    <ghs-main-nav-profile className="mainNavCol mainNavProfile">
                                        <div at-toggleusermenu="true">
                                            <ghs-dropdown tabindex="0" className="s-dropdown undefined dropdown">
                                                <ghs-dropdown-toggle>
                                                    <section aria-haspopup="true" at-profilesegment="true" className="s-dropdown">
                                                        <button type="button" className="s-btn mainNavProfile-container u-flex u-flex-align-xs--center u-text-secondary">
                                                            <span className="s-btn s-iconBtn mainNavProfile-image-container u-text-center u-flex-center-center u-stack-x-2 s-iconBtn--small u-hidden-md--up">
                                                                <ghs-social-icon>
                                                                    <div at-social-image-fallback="true">
                                                                        <span className="mainNavProfile-user-initial u-margin-cancel h6">K</span>
                                                                    </div>
                                                                </ghs-social-icon>
                                                                </span>
                                                                <span className="u-hidden-md--down mainNavProfile-text-container u-flex u-flex-align-xs--center u-clickable u-text-secondary u-inset-3 u-rounded caption">
                                                                <span className="u-stack-x-1">Hi,</span>
                                                                <span at-signin-name="true" className="mainNavProfile-name u-stack-x-1">Keerthi</span>
                                                                <cb-icon className="mainNavProfile-caret">
                                                                    <svg className="cb-icon cb-icon-svg cb-icon--xs cb-icon--down" aria-hidden="true">
                                                                        <use href="#caret">
                                                                            #shadow-root(closed)
                                                        <svg viewBox="0 0 24 24" id="caret" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill="none" d="M0 0h24v24H0z"></path>
                                                                                <path fill="currentColor" d="M18.6 7.51l2.48 2.47-6.6 6.6-2.47 2.47-2.47-2.47-6.55-6.55 2.48-2.47 6.54 6.54 6.59-6.59zm0 0"></path>
                                                                            </svg>
                                                                        </use>
                                                                    </svg>
                                                                </cb-icon>
                                                            </span>
                                                        </button>
                                                    </section>
                                                    </ghs-dropdown-toggle>
                                                <ghs-dropdown-menu></ghs-dropdown-menu>
                                            </ghs-dropdown>
                                        </div>
                                        </ghs-main-nav-profile>
                                        
                                        <ghs-fixed-bag-launcher className="mainNavCol mainNavMenu">
                                            <button type="button" aria-label="Toggle your bag (Open/Closed)" className="ghs-toggleCart s-btn s-iconBtn s-iconBtn--small mainNavMenu-cartBtn u-flex-center-center s-btn-tertiary--inverted">
                                                <cb-icon className>
                                                    <svg className ="cb-icon cb-icon-svg cb-icon--sm" aria-hidden="true">
                                                        <use href="#bag">
                                                            #shadow-root(closed)
                                                            <svg viewBox="0 0 24 24" id ="bag" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill ="none" d="M0 0h24v24H0z"></path>
                                                                <path fill ="current color" d="M21 18.28L19.8 7h-2.74c0-2.79-2.27-5.06-5.06-5.06-2.79 0-5.06 2.27-5.06 5.06H4.2L3 18.28v-.02c-.12 1.39.91 2.61 2.29 2.73.12.01.24.02.35.01h12.72c1.39.07 2.57-.99 2.64-2.38.01-.12.01-.24 0-.36v.02zM12 4.5c1.4 0 2.54 1.12 2.56 2.52L9.44 7v.02C9.46 5.62 10.6 4.5 12 4.5zM8.12 12c-.83 0-1.5-.67-1.5-1.5S7.29 9 8.12 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.76 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0 0"></path> 
                                                            </svg>
                                                        </use>
                                                    </svg>  
                                                </cb-icon>    
                                                </button> 
                                    </ghs-fixed-bag-launcher>
                                </ghs-main-nav>
                                </div>
                                <div id="ghs-outerWrapper" className ="outerWrapper clearfix">
                                <ghs-notifications>
                                    <div className ="notifications"></div>
                                </ghs-notifications>
                                <div className="innerWrapper clearfix content-transition">
                                    <ghs-router-outlet>
                                        <ghs-homepage-logged-in>
                                            <ghs-page-view-analytics-helper></ghs-page-view-analytics-helper>
                                            <div className="homePage-wrapper homePage-wrapper--loggedIn u-flex u-flex-direction-column">
                                                <ghs-sev-one className ="u-homepageOrder-0"></ghs-sev-one>
                                                <a id= "skip-top" tabindex="0"></a>
                                                <div className="u-background u-homepageOrder-0">
                                                    <div at-homepage-orderstatusbanner="true" className="order-status-banner collapsed">
                                                        <ghs-carousel className>
                                                            <div className ="ghsCarousel">
                                                                <div className="ghsCarousel-previous ghsCarousel-arrows undefined ghsCarousel-arrow-enable ghsCarousel-arrows-hideDesktop ghsCarousel-arrows-hideMobile ghsCarousel-arrow s-iconBtn--large s-btn s-iconBtn s-btn-primary--inverted s-iconBtn-shadow" >
                                                                    <cb-icon className>
                                                                        <svg className="cb-icon cb-icon-svg cb-icon--lg cb-icon--left" aria-hidden="true">
                                                                            <use href="#caret">
                                                                                #shadow-root(closed)
                                                                                
                                                                            </use>

                                                                        </svg>
                                                                    </cb-icon>
                                                                </div>
                                                            </div>
                                                        </ghs-carousel>
                                                    </div>
                                                </div>
                                            </div>
                                        </ghs-homepage-logged-in>
                                    </ghs-router-outlet>
                                </div>

                                    
                                    
                                    
                                
                                
                                </div>    
                                
                                    BuyerHomePage
                                   
                           

                        </ghs-app-content>
                    </ghs-app>
                </ghs-site-container>
                

            </div>

        )
    }
}



export default BuyerHomePage;
