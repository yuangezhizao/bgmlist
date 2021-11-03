import useSWR, { SWRConfig } from 'swr';
import { Grid, Header, HeaderContent, Icon, Image, Menu, Popup, Table } from 'semantic-ui-react';
import moment from 'moment';
import Head from '../components/BaseHead';

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

function Bangumi() {
  const { data } = useSWR(API, fetcher, {
    // revalidateIfStale: false,
    revalidateOnFocus: false, //窗口聚焦时自动重新验证
    revalidateOnReconnect: false //浏览器恢复网络连接时自动重新验证
  });
  // `data` 将始终是可用的。因为它在`fallback`中

  // there should be no `undefined` state
  console.log('Is data ready?', !!data);

  return (
    <>
      <Head />
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
                  <Table.HeaderCell>No.</Table.HeaderCell>
                  <Table.HeaderCell>放送季度</Table.HeaderCell>
                  <Table.HeaderCell>番剧名称</Table.HeaderCell>
                  <Table.HeaderCell>番剧类型</Table.HeaderCell>
                  <Table.HeaderCell>番剧话数</Table.HeaderCell>
                  <Table.HeaderCell className="one wide">轻小说</Table.HeaderCell>
                  <Table.HeaderCell className="one wide">漫画</Table.HeaderCell>
                  <Table.HeaderCell className="one wide">动画</Table.HeaderCell>
                  <Table.HeaderCell>追番状态</Table.HeaderCell>
                  <Table.HeaderCell>追番源</Table.HeaderCell>
                  <Table.HeaderCell>吐了个槽</Table.HeaderCell>
                  <Table.HeaderCell>数据插入时间</Table.HeaderCell>
                  <Table.HeaderCell>数据更新时间</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((each, index) => (
                  <Table.Row key={data.length - index}>
                    <Table.Cell className={get_color(each.season)}>
                      {data.length - index}
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
                            <Image
                              src={
                                'https://lab.yuangezhizao.cn/api/v0.0.1/bangumi?animation=' +
                                animation
                              }
                              size="tiny"
                            />
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
