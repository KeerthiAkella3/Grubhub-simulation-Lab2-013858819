import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '../components/Profiles/BuyerPicture';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('test tp display page in editmode and show update button when edit button is clicked',() =>{
    test('renders list-items', () => {
        const wrapper = shallow(<Profile />);

        wrapper.find('button').simulate('click');
        expect(wrapper.find('UpdateButton')).toBeDefined();
      })
    });