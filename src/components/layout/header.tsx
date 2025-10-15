"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Menu, Bot } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
    { href: '#overview', label: 'Overview' },
    { href: '#data-sources', label: 'Data Sources' },
    { href: '#modeling-approach', label: 'Modeling Approach' },
    { href: '#demo', label: 'Turnover Prediction' },
];

export default function Header() {
    const [activeSection, setActiveSection] = useState('overview');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observerInstance = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: "-20% 0px -75% 0px" });

        observer.current = observerInstance;

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (observer.current) {
                observer.current.observe(section);
            }
        });

        return () => {
            sections.forEach(section => {
                if (observer.current) {
                    observer.current.unobserve(section);
                }
            });
        };
    }, []);

    const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => (
        <Link
            href={href}
            onClick={() => isMobile && setIsMenuOpen(false)}
            className={cn(
                "font-medium pb-1 transition-colors hover:text-primary",
                activeSection === href.substring(1)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground",
                isMobile && "text-lg"
            )}
        >
            {label}
        </Link>
    );

    return (
        <header className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Bot className="h-7 w-7 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                        Turnover<span className="text-primary">AI</span>
                    </h1>
                </Link>
                <div className="hidden md:flex space-x-8">
                    {navItems.map(item => <NavLink key={item.href} {...item} />)}
                </div>
                <div className="md:hidden">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col space-y-6 pt-10">
                                {navItems.map(item => <NavLink key={item.href} {...item} isMobile />)}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
