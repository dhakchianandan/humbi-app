import { useEffect, useRef } from 'react';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import cuid from 'cuid';
import { LoaderCircleIcon, SendHorizontalIcon } from 'lucide-react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { auth } from '~/auth';
import prisma from '~/db.server';
import Message from '~/components/message';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { chatId } = params;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return redirect('/chats');
    }

    // Prisma doesn't support JSON type
    // @ts-ignore
    chat.messages = JSON.parse(chat.messages);

    return json({ chat });
  }

  return redirect('/');
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;
    const { query, chatId, messageId } = Object.fromEntries(
      await request.formData(),
    );

    const message = {
      id: cuid(),
      role: 'user',
      type: 'generic',
      text: query,
      createdAt: new Date(),
    };

    let chat = await prisma.chat.findUnique({
      where: {
        id: chatId.toString(),
        userId: user.id,
      },
    });

    if (!chat) {
      return redirect('/chats');
    }
    // 'The dynamics of being in position (acting after your opponents) versus out of position (acting before your opponents) are magnified in short-handed games. Players must adapt by playing a wider range of hands, especially in later positions, and by being more aggressive to leverage the positional advantage.',
    const reply = {
      id: cuid(),
      role: 'assistant',
      type: 'generic',
      text: (await getPandaResponse(query.toString())).toString,
      createdAt: new Date(),
      feedback: 0,
      // feedback: Math.floor(Math.random() * 3),
    };

    await prisma.chat.update({
      where: { id: chatId.toString() },
      data: {
        messages: JSON.stringify([
          ...JSON.parse(chat.messages),
          message,
          reply,
        ]),
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return json({ ok: true });
  }

  return redirect('/');
}

export default function Chat() {
  const navigation = useNavigation();
  const data = useActionData<typeof action>();
  const { chat } = useLoaderData<typeof loader>();

  const inputRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    if (data?.ok) {
      inputRef.current?.reset();
    }
  }, [data]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-4">
          {/* @ts-ignore */}
          {chat?.messages.map((message) => (
            <Message key={message.id} message={message} chatId={chat.id} />
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>
      <Form
        ref={inputRef}
        method="post"
        className="flex gap-2 sticky bottom-0 bg-gray-50 p-2"
      >
        <Input type="hidden" name="chatId" value={chat.id} />
        <Input
          type="text"
          name="query"
          placeholder="Message Humbi LLM"
          autoComplete="off"
          autoFocus
          className="font-serif"
          disabled={navigation.state === 'submitting'}
        />
        <Button type="submit" disabled={navigation.state === 'submitting'}>
          {navigation.state === 'submitting' ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <SendHorizontalIcon />
          )}
        </Button>
      </Form>
    </div>
  );
}

async function getPandaResponse(rawText: string): Promise<string> {
  try {
    const response = await fetch(
      'http://127.0.0.1:5000/get?msg=' + encodeURIComponent(rawText),
    );
    const data = await response.text(); // Adjust if the response is JSON
    console.log('## here');
    console.log(rawText);
    console.log('' + data);
    console.log('' + data.toString());
    return data; // Return the data directly
  } catch (error) {
    console.error('Error fetching bot response:', error);
    throw error; // Optionally re-throw the error for further handling
  }
}

