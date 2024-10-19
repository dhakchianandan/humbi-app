import { Form, NavLink, useFetcher, useLoaderData } from '@remix-run/react';
import {
  ArchiveIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
  TrashIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { loader } from '~/routes/chats';

export default function Chats() {
  const fetcher = useFetcher();
  const { user, chats } = useLoaderData<typeof loader>();

  return (
    <Sidebar>
      <SidebarHeader className="font-serif font-semibold">Chats</SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent className="p-2">
          <SidebarMenu>
            {chats.map((chat, index) => (
              <SidebarMenuItem className="py-1" key={chat.id}>
                <SidebarMenuButton className="hover:bg-gray-200" asChild>
                  <NavLink
                    to={`/chats/${chat.id}`}
                  >{`Humbi LLM Chat #${chats.length - index}`}</NavLink>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className="mt-1">
                      <EllipsisVerticalIcon />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={'right'}
                    align={'start'}
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        fetcher.submit(
                          {},
                          { method: 'post', action: `/api/chats/${chat.id}` },
                        );
                      }}
                    >
                      <TrashIcon />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <ArchiveIcon />
                      <span>Archive</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <Form method="post" className="flex justify-between items-center pb-2">
          <h5 className="font-semibold">{user.name.split(' ')[0]}</h5>
          <button type="submit">
            <LogOutIcon className="w-4 h-4" />
          </button>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
