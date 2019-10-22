import React from 'react';
import renderer from 'react-test-renderer';
import BuyerSignInForm from '../components/SignIn/BuyerSignInForm'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });


describe('NewCourse', () => {
    it('should render correctly', () => {
      const component = shallow(<BuyerSignInForm />);
    
      expect(component).toMatchSnapshot();
    });
  });