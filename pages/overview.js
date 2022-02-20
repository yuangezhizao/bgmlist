import _ from 'lodash';
import React from 'react';
import useSWR, { SWRConfig } from 'swr';
import {
  Divider,
  Grid,
  Header,
  HeaderContent,
  Icon,
  Image,
  Menu,
  Popup,
  Table
} from 'semantic-ui-react';
import moment from 'moment';
import BaseHeader from '../components/BaseHeader';
import BaseFooter from '../components/BaseFooter';

const fetcher = (url) => fetch(url).then((res) => res.json());
const API = 'https://lab.yuangezhizao.cn/api/v0.0.1/bangumi?overview';

export async function getStaticProps() {
  // `getStaticProps` 在服务器端执行
  const data = await fetcher(API);
  return {
    props: {
      fallback: {
        [API]: data
      }
    }
  };
}

function get_color(season) {
  if (season > 100) {
    if (season % 100 < 3) {
      return 'blue';
    } else if (season % 100 < 6) {
      return 'green';
    } else if (season % 100 < 9) {
      return 'yellow';
    } else {
      return 'orange';
    }
  } else {
    return 'pink';
  }
}

function get_type(type) {
  switch (type) {
    case 1:
      return '短篇';
    case 2:
      return '季番';
    case 3:
      return '半年番';
    case 4:
      return '全年番';
    case 5:
      return '剧场版';
    case 6:
      return 'OVA';
    default:
      return '-';
  }
}

// Refer: https://react.semantic-ui.com/collections/table/#variations-sortable
function exampleReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        return {
          ...state,
          sorted_data: state.sorted_data.slice().reverse(),
          direction: state.direction === 'ascending' ? 'descending' : 'ascending'
        };
      }

      return {
        column: action.column,
        sorted_data: _.sortBy(state.sorted_data, [action.column]),
        direction: 'ascending'
      };
    default:
      throw new Error();
  }
}

function Bangumi() {
  const { data } = useSWR(API, fetcher, {
    // revalidateIfStale: false,
    revalidateOnFocus: false, //窗口聚焦时自动重新验证
    revalidateOnReconnect: false //浏览器恢复网络连接时自动重新验证
  });
  // `data` 将始终是可用的。因为它在`fallback`中

  // there should be no `undefined` state
  console.log('Is data ready?', !!data);

  const [state, dispatch] = React.useReducer(exampleReducer, {
    column: null,
    sorted_data: data,
    direction: null
  });
  const { column, sorted_data, direction } = state;

  return (
    <>
      <BaseHeader />
      <Grid centered>
        <Grid.Column wide={12}>
          <Menu pointing color="blue">
            <Menu.Item active>
              <Icon name="tv" />
              总日漫表
            </Menu.Item>
            <Menu.Item href="/">
              <Icon name="arrow left" />
              返回首页
            </Menu.Item>
          </Menu>
          <Grid.Column wide={12}>
            <Header dividing color="blue">
              <HeaderContent>
                <h2>我的所有追番</h2>
                <Header sub>
                  数据来自：<a href="https://bgmlist.com/">番组放送</a>
                </Header>
              </HeaderContent>
            </Header>
            <Table compact sortable celled unstackable striped color="blue">
              <Table.Header>
                <Table.Row positive>
                  <Table.HeaderCell
                    sorted={column === 'index' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'index' })}>
                    No.
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'season' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'season' })}>
                    放送季度
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'title' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'title' })}>
                    番剧名称
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'type' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'type' })}>
                    番剧类型
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'episodes' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'episodes' })}>
                    番剧话数
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="one wide"
                    sorted={column === 'novel' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'novel' })}>
                    轻小说
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="one wide"
                    sorted={column === 'comics' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'comics' })}>
                    漫画
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    className="one wide"
                    sorted={column === 'animation' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'animation' })}>
                    动画
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'status' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'status' })}>
                    追番状态
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'blu_ray' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'blu_ray' })}>
                    追番源
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'tips' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'tips' })}>
                    吐了个槽
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'insert_time' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'insert_time' })}>
                    数据插入时间
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'update_time' ? direction : null}
                    onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'update_time' })}>
                    数据更新时间
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sorted_data.map((each, index) => (
                  <Table.Row key={sorted_data.length - index}>
                    <Table.Cell className={get_color(each.season)}>
                      {sorted_data.length - index}
                    </Table.Cell>
                    <Popup
                      trigger={
                        <Table.Cell className={get_color(each.season)}>{each.season}</Table.Cell>
                      }
                      content={moment(each.run_time).utc().format('YYYY-MM-DD')}
                      inverted
                    />
                    <Table.Cell>{each.title}</Table.Cell>
                    <Table.Cell>{get_type(each.type)}</Table.Cell>
                    <Table.Cell>{each.episodes}</Table.Cell>
                    <Table.Cell>{each.novel}</Table.Cell>
                    <Table.Cell>{each.comics}</Table.Cell>
                    <Table.Cell>
                      {each.animation.split(',').map((animation) => (
                        <Popup
                          key={animation}
                          trigger={
                            <Image src={'/api/bangumi?animation=' + animation} size="tiny" />
                          }
                          content={animation}
                          inverted
                        />
                      ))}
                    </Table.Cell>
                    <Table.Cell>{each.status}</Table.Cell>
                    <Table.Cell>{each.blu_ray}</Table.Cell>
                    <Table.Cell>{each.tips}</Table.Cell>
                    <Popup
                      trigger={
                        <Table.Cell>
                          {moment(each.insert_time).utc().format('YYYY-MM-DD')}
                        </Table.Cell>
                      }
                      content={moment(each.insert_time).utc().format('YYYY-MM-DD HH:mm:ss')}
                      inverted
                    />
                    <Popup
                      trigger={
                        <Table.Cell>
                          {moment(each.update_time).utc().format('YYYY-MM-DD')}
                        </Table.Cell>
                      }
                      content={moment(each.update_time).utc().format('YYYY-MM-DD HH:mm:ss')}
                      inverted
                    />
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Column>
      </Grid>
      <Divider />
      <BaseFooter />
    </>
  );
}

export default function Overview({ fallback }) {
  // 被`SWRConfig` 所包裹的 SWR hooks 将能够使用这些值
  return (
    <SWRConfig value={{ fallback }}>
      <Bangumi />
    </SWRConfig>
  );
}
