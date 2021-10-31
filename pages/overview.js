import useSWR, { SWRConfig } from 'swr';
import { Grid, Header, HeaderContent, Icon, Menu, Table } from 'semantic-ui-react';
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

function Bangumi() {
  const { data, error } = useSWR(API);
  // `data` 将始终是可用的。因为它在`fallback`中

  // there should be no `undefined` state
  console.log('Is data ready?', !!data);

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';
  return (
    <>
      <Head />
      <body>
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
                    <Table.HeaderCell>插入时间</Table.HeaderCell>
                    <Table.HeaderCell>更新时间</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map((each) => (
                    <Table.Row key={each.id}>
                      <Table.Cell>{each.id}</Table.Cell>
                      <Table.Cell>{each.season}</Table.Cell>
                      <Table.Cell>{each.title}</Table.Cell>
                      <Table.Cell>{each.type}</Table.Cell>
                      <Table.Cell>{each.episodes}</Table.Cell>
                      <Table.Cell>{each.novel}</Table.Cell>
                      <Table.Cell>{each.comics}</Table.Cell>
                      <Table.Cell>{each.animation}</Table.Cell>
                      <Table.Cell>{each.status}</Table.Cell>
                      <Table.Cell>{each.blu_ray}</Table.Cell>
                      <Table.Cell>{each.insert_time}</Table.Cell>
                      <Table.Cell>{each.update_time}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Column>
        </Grid>
      </body>
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
