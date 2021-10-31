import styled from 'styled-components';
import { Header, Message, MessageContent, MessageHeader, Segment } from 'semantic-ui-react';
import Link from 'next/link';
import BaseHead from '../components/BaseHead';

const StyledContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    margin: 10px 0 10px 0;
  }

  .footer {
    padding: 20px;
    border-top: solid 1px #aaa;
  }
`;

const Home = () => (
  <>
    <BaseHead />
    <StyledContainer>
      <div>
        <Header as="h1">总日漫表</Header>
      </div>
      <div>
        <Message positive>
          <MessageHeader>欢迎访问 ヽ(･ω･´ﾒ)</MessageHeader>
          <MessageContent>这里是自己看过的全部日漫，真就老二次元了</MessageContent>
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
    </StyledContainer>
  </>
);

export default Home;
