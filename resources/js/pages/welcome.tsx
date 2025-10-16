import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const departments =
        ((usePage().props as any)?.departments as {
            id: number;
            dname: string;
        }[]) || [];

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
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">

                {/* ✅ Fixed Top Navigation Bar */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFC]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#1914001a] dark:border-[#3E3E3A]/50">
                    <nav className="max-w-6xl mx-auto flex items-center justify-end gap-4 px-6 py-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* ✅ Add top padding so content doesn’t hide behind header */}
                <main className="w-full max-w-2xl text-center flex-grow flex flex-col justify-center px-6 pt-24">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-3">
                        Customer Request Form
                    </h1>
                    <p className="text-base text-[#444] dark:text-[#b3b3b3] mb-8">
                        Submit your request. We'll get back to you as soon as possible.
                    </p>
                </main>

                <footer className="mt-12 mb-6 text-xs text-[#6b6b6b] dark:text-[#777]">
                    © {new Date().getFullYear()} Customer Service Portal
                </footer>
            </div>
        </>
    );
}