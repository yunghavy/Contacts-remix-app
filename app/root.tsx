import { json, redirect } from "@remix-run/node";
import {
  Form,
  NavLink,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import type { LinksFunction, LoaderFunctionArgs, } from "@remix-run/node";
// existing imports
import { createEmptyContact, getContacts } from "./data";
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
  return json({ contact });
};


  export const loader = async ({
    request,
  }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return json({ contacts, q });
};

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );
  const [query, setQuery] = useState(q || "");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div 
         className={
          navigation.state === "loading" && !searching
            ? "loading"
            : ""
        }
        id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
          <div id="detail">
          <Outlet />
        </div>
            <Form id="search-form" 
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
            role="search">
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
                onChange={(event) =>
                  setQuery(event.currentTarget.value)
                }
                value={query}
              />
              <div id="search-spinner"
              hidden={!searching}
              aria-hidden/>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                   <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >

                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
