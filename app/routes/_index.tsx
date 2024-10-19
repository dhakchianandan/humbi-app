import type { MetaFunction } from '@remix-run/node';

import { signIn } from '~/auth.client';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [
    { title: 'HUMBI LLM' },
    {
      name: 'description',
      content:
        'interact with your databases in the most intuitive way—using natural language',
    },
  ];
};

export default function Index() {
  return (
    <main className="flex flex-col justify-center items-center gap-2">
      <h1 className="font-serif font-bold text-4xl">HUMBI LLM</h1>
      <h2>
        Interact with your databases in the most intuitive way—using natural
        language
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn.social({
            provider: 'google',
            callbackURL: '/chats/new',
          });
        }}
      >
        <Button type="submit">Get Started Today</Button>
      </form>
    </main>
  );
}
