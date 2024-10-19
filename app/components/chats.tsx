import { Form, useLoaderData } from '@remix-run/react';
import { LogOutIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '~/components/ui/sidebar';
import { loader } from '~/routes/chats';

export default function Chats() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Sidebar>
      <SidebarContent className="p-2 mt-2">
        <h5 className="font-serif">Chats</h5>
      </SidebarContent>
      <SidebarFooter>
        <Form method="post" className="flex justify-between items-center pb-6">
          <h5 className="font-semibold">{user.name.split(' ')[0]}</h5>
          <button type="submit">
            <LogOutIcon className="w-4 h-4" />
          </button>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
