import { Form, json, Link, Outlet, useLoaderData } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';

import { auth } from '~/auth';
import prisma from '~/db.server';
import Chats from '~/components/chats';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;

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

    return json({ user, chats });
  }

  return redirect('/');
}

export async function action({ request }: ActionFunctionArgs) {
  const { success } = await auth.api.signOut({
    headers: request.headers,
  });

  if (success) {
    return redirect('/');
  }

  return json({});
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main>
      <SidebarProvider defaultOpen={true}>
        <Chats />
        <div className="w-full flex flex-col">
          <header className="w-full bg-gray-50 flex justify-between items-center sticky top-0">
            <div className="flex gap-2 items-center">
              <SidebarTrigger />
              <h1 className="font-bold font-serif">Humbi</h1>
            </div>

            <div className="flex gap-2 items-center">
              <Form method="post" action="/chats?index">
                <button className="font-bold font-serif text-sm underline">
                  + New Chat
                </button>
              </Form>
              <Avatar className="p-1">
                <AvatarImage src={user.image} />
                <AvatarFallback className="bg-gray-200 uppercase font-bold">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="h-full flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
