import React, { Component } from 'react';
import { Icon, Menu } from 'semantic-ui-react';

export default class IndexMenu extends Component {
  state = { activeItem: 'home' };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu pointing>
        <Menu.Item active={activeItem === 'home'} color={'blue'}>
          <Icon name="home" />
          首页
        </Menu.Item>
        <Menu.Item href="https://github.com/yuangezhizao/bgmlist" target="_blank" color={'blue'}>
          <Icon name="archive" />
          源码
        </Menu.Item>
      </Menu>
    );
  }
}
