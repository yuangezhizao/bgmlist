import { Message, MessageContent } from 'semantic-ui-react';

function BaseFooter() {
  return (
    <div style={{ textAlign: 'center' }}>
      <footer>
        <Message info>
          <MessageContent>
            yuangezhizao © 2021 - 2022<br></br>
            Powered by {process.env.DEPLOYED_ON}
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
