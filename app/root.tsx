import {Links, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import CSS from "../css/app.css?url";
import React from "react";
import {LinksFunction} from "@remix-run/node";
import {ThemeModeScript} from "flowbite-react";
import {Toaster} from "react-hot-toast";

export function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
            <ThemeModeScript/>
            <title>Trash Monitoring</title>
        </head>
        <body style={{height: "100vh"}}>
        <div><Toaster/></div>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export const links: LinksFunction = () => {
    return [{rel: "stylesheet", href: CSS}]
}

export default function App() {
    return <Outlet/>;
}
