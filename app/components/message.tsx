import { useFetcher } from '@remix-run/react';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

import { Input } from '~/components/ui/input';

// @ts-ignore
export default function Message({ message, chatId }) {
  const up = useFetcher();
  const down = useFetcher();

  function get() {
    switch (message.role) {
      case 'user':
        return (
          <li className="w-fit font-serif break-words px-4 py-2 self-end bg-gray-200 rounded-md">
            {message.text}
          </li>
        );
      case 'assistant':
        return (
          <li className="px-4 py-2 self-start bg-gray-50 rounded-lg">
            <p className="w-fit break-words">{message.text}</p>
            <div className="flex gap-2">
              <up.Form
                method="post"
                action={`/api/chats/${chatId}/messages/${message.id}`}
              >
                <Input type="hidden" name="upvote" value="true" />
                <button type="submit" className="p-1">
                  <ThumbsUpIcon
                    className={`size-6 hover:fill-green-400 ${message.feedback === 1 ? 'fill-green-500' : ''}`}
                  />
                </button>
              </up.Form>
              <down.Form
                method="post"
                action={`/api/chats/${chatId}/messages/${message.id}`}
              >
                <Input type="hidden" name="downvote" value="true" />
                <button type="submit" className="p-1">
                  <ThumbsDownIcon
                    className={`size-6 hover:fill-red-400 ${message.feedback === 2 ? 'fill-red-500' : ''}`}
                  />
                </button>
              </down.Form>
            </div>
          </li>
        );
      default:
        return <li className="text-red-500">{message.text}</li>;
    }
  }

  return <>{get()}</>;
}
