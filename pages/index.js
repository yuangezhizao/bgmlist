import {
  Container,
  Divider,
  Header,
  Message,
  MessageContent,
  MessageHeader,
  Segment
} from 'semantic-ui-react';
import Link from 'next/link';
import BaseHeader from '../components/BaseHeader';
import IndexMenu from '../components/IndexMenu';

const Home = () => (
  <>
    <BaseHeader />
    <Container>
      <IndexMenu />
      <div>
        <Message positive>
          <MessageHeader as="h2" className="ui header">
            欢迎访问 ヽ(･ω･´ﾒ)
          </MessageHeader>
          <p>
            这里是自己看过的全部日漫，真就老二次元了！
            <a href="https://www.yuangezhizao.cn/articles/nodejs/Next.js/bgmlist.html">查看简介</a>
          </p>
        </Message>
        <Header as="h4" block attached="top" color="blue">
          我的所有追番
        </Header>
        <Segment attached color="blue">
          <Link href="/overview">
            <a>总览</a>
          </Link>
        </Segment>
      </div>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <footer>
          <Message info>
            <MessageContent>
              yuangezhizao © 2021 - 2022<br></br>
              Powered by Tencent Cloud Serverless
            </MessageContent>
          </Message>
        </footer>
      </div>
    </Container>
  </>
);

export default Home;
