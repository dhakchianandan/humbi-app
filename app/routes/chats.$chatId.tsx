import { Form, json } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';

import { SendHorizontalIcon } from 'lucide-react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export function loader({ params }: LoaderFunctionArgs) {
  const { chatId } = params;

  if (chatId === 'new') {
  } else {
  }

  return json({});
}

export default function Chat() {
  return (
    <div className="h-full pb-8 flex flex-col">
      <div className="flex-1">
        <h5>Chat</h5>
      </div>
      <Form method="post" className="flex gap-2">
        {/* <Textarea
          rows={2}
          className="resize-none"
          placeholder="query and enter...."
        /> */}

        <Input placeholder="Message Humbi LLM" autoFocus />
        <Button type="submit">
          <SendHorizontalIcon />
        </Button>
      </Form>
    </div>
  );
}
