import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '../components/Profiles/BuyerProfilePage';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('to display button',() =>{
    test('renders list-items', () => {
        const wrapper = shallow(<Profile />);
        expect(wrapper.find('UpdateButton')).toBeDefined();
      })
    });