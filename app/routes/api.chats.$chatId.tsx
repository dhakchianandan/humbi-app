import { ActionFunctionArgs, json, redirect } from '@remix-run/node';

import { auth } from '~/auth';
import prisma from '~/db.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;
    const { chatId } = params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return redirect('/chats');
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { deletedAt: new Date() },
    });

    const chats = await prisma.chat.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (chats.length) {
      return json({});
    } else {
      return redirect('/chats');
    }
  }

  return redirect('/');
}
