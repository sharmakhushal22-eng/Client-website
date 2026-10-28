import { notFound } from 'next/navigation'

/* A URL that matches no route never reaches (site)/not-found.tsx on its own:
 * Next answers it from the root, outside this group's layout, with its bare
 * default page and no header or footer. Catching it here and calling
 * notFound() renders the site's own 404, inside the site chrome. Every real
 * route is more specific than this one, so it only ever sees misses. */
export default function Missing() {
  notFound()
}
