import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    // const departments =
    //     ((usePage().props as any)?.departments as {
    //         id: number;
    //         dname: string;
    //     }[]) || [];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            {/* Full Page Container */}
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">

                {/* Fixed Top Navigation Bar */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <nav className="max-w-6xl mx-auto flex items-center justify-end gap-4 px-6 py-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-lg border border-indigo-200 bg-white px-5 py-2 font-medium text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm dark:border-indigo-800 dark:bg-slate-800 dark:text-indigo-300 dark:hover:border-indigo-700 dark:hover:bg-slate-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-lg px-5 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <main className="w-full max-w-2xl text-center flex-grow flex flex-col justify-center px-6 pt-24">
                    {/* <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        Welcome
                    </div> */}
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-900 bg-clip-text text-transparent dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100">
                        Customer Request Form
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Submit your request and we'll get back to you as soon as possible.
                    </p>
                </main>

                <footer className="mt-12 mb-6 text-sm text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} Customer Request Form
                </footer>
            </div>
        </>
    );
}