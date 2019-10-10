import React from 'react';
import './App.css';
import './Form.css';
import Home from './components/LandingPage/Home';
import GettingStarted from './components/LandingPage/GettingStarted';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Buyer Pages
import LandingPage from './components/LandingPage/LandingPage'
import BuyerSignIn from './components/SignIn/BuyerSignIn';
import BuyerSignUp from './components/SignUp/BuyerSignUpForm';
import BuyerHomePage from './components/BuyerPages/BuyerHomePage';
import BuyerProfilePage from './components/Profiles/BuyerProfilePage'
import BuyerSearchPage from './components/BuyerPages/BuyerSearchPage';
import BuyerRestaurantDetailsPage from './components/BuyerPages/BuyerRestaurantDetailsPage';
import BuyerOrderPage from './components/BuyerPages/BuyerOrdersPage';

// Import Owner Pages
import OwnerSignUp from './components/SignUp/OwnerSignUpForm';
import OwnerSignIn from './components/SignIn/OwnerSignIn';
import CompOwnerPage from './components/OwnerPages/CompOwnerPage';



function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={LandingPage} />
        <Route path="/BuyerSignUp" component={BuyerSignUp} />
        <Route path="/BuyerSignIn" component={BuyerSignIn} />
        <Route path='/BuyerHomePage' component={BuyerHomePage}/>
        <Route path="/BuyerProfilePage" component={BuyerProfilePage} />
        <Route path="/BuyerSearchPage" component={BuyerSearchPage}/>
        <Route path='/BuyerRestaurantDetailsPage' component={BuyerRestaurantDetailsPage}/>
        <Route path='/BuyerOrderPage' component={BuyerOrderPage}/>
        {/* Owner Components */}
        <Route path="/OwnerSignUp" component={OwnerSignUp} />
        <Route path="/OwnerSignIn" component={OwnerSignIn} />
        <Route path='/OwnerHomePage' component={CompOwnerPage}/>
        {/* <Route path='/buyerOrdersPage' component={BuyerOrdersPage}/> */}
      </div>
    </Router>
  );
}

export default App;
