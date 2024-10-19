import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { auth } from '~/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request);
}
