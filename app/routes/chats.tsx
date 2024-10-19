import { json, Outlet, useLoaderData } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';

import { auth } from '~/auth';
import Chats from '~/components/chats';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    const { user } = session;

    return json({ user });
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
      <SidebarProvider>
        <Chats />
        <div className="w-full flex flex-col">
          <header className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <SidebarTrigger />
              <h1 className="font-bold font-serif">Humbi</h1>
            </div>

            <Avatar className="p-1">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-gray-200 uppercase font-bold">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </header>

          <div className="p-1 h-full">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
