import { Message, MessageContent } from 'semantic-ui-react';

function BaseFooter() {
  return (
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
  );
}

export default BaseFooter;
