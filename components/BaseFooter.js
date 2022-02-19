import { Message, MessageContent } from 'semantic-ui-react';

let deployed_on = '';
if (process.env.VERCEL === '1') {
    deployed_on = 'Vercel';
} else {
    deployed_on = 'Tencent Cloud Serverless';
}

function BaseFooter() {
  return (
    <div style={{ textAlign: 'center' }}>
      <footer>
        <Message info>
          <MessageContent>
            yuangezhizao © 2021 - 2022<br></br>
            Powered by {deployed_on}
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && (
              <>
                <br></br>
                <a
                  href={
                    'https://github.com/yuangezhizao/bgmlist/commit/' +
                    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
                  }>
                  #{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7)}
                </a>
              </>
            )}
          </MessageContent>
        </Message>
      </footer>
    </div>
  );
}

export default BaseFooter;
