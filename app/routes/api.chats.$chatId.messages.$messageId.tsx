import { ActionFunctionArgs, json, redirect } from '@remix-run/node';

import { auth } from '~/auth';
import prisma from '~/db.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;
    const { chatId, messageId } = params;
    const { upvote, downvote } = Object.fromEntries(await request.formData());

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return redirect('/chats');
    }

    const messages = JSON.parse(chat.messages);
    // @ts-ignore
    const message = messages.find((m) => m.id == messageId);

    if (message) {
      if (upvote) {
        message.feedback = 1;
      } else if (downvote) {
        message.feedback = 2;
      }

      await prisma.chat.update({
        where: { id: chatId },
        data: { messages: JSON.stringify(messages) },
      });

      return json({});
    }

    return redirect(`/chats/${chatId}`);
  }

  return redirect('/');
}
