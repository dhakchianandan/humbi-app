import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';

import { auth } from '~/auth';
import { Button } from '~/components/ui/button';
import prisma from '~/db.server';

export async function action({ request }: ActionFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;
    const chat = await prisma.chat.create({
      data: {
        userId: user.id,
      },
    });

    return redirect(`/chats/${chat.id}`);
  }

  return redirect('/');
}

export default function Chats() {
  return (
    <div className="h-full flex flex-col gap-4 justify-center items-center text-center">
      <h2>Start a New Conversation or Pick Up Where You Left Off</h2>

      <Form method="post">
        <Button>Start a New Chat</Button>
      </Form>
    </div>
  );
}
