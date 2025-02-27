import {
  Facebook,
  Instagram,
  Linkedin,
  InstagramIcon as Tiktok,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import { Icons } from '../icons';
import MaxWidthWrapper from '../max-width-wrapper';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-brand-blue-900 to-brand-blue-800 text-white">
      <MaxWidthWrapper className="py-12">
        <div className="w-full grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* About Column - Right Aligned */}
          <div className="space-y-6 lg:text-left">
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Planning Column - Center Aligned */}
          <div className="space-y-6 lg:text-center">
            <h3 className="text-lg font-semibold">Celebrate Your Event</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  How to Prepare an Event
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  How to Organize a Competition Event
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  How to Promote Your Event
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  How to Plan a Music Event
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  How to Manage an Event
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Crafting an Engaging Event Concept
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Hosting an Event in a Co-Working Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Inspiration Column - Right Aligned */}
          <div className="space-y-6 lg:text-right">
            <h3 className="text-lg font-semibold">Event Inspiration</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Festival
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Concert
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Workshop &amp; Seminar
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Theater &amp; Drama
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Attractions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-12 flex flex-col items-center">
          <h4 className="text-center">Security &amp; Privacy</h4>
          <Icons.Bsi className="text-white size-40 line-clamp-1 mx-auto" />
        </div>

        {/* Social Media */}
        <div className="text-center">
          <h4 className="mb-4">Follow Us</h4>
          <div className="flex justify-center gap-6">
            <Link href="#" className="hover:text-gray-300">
              <Instagram className="size-6" />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Tiktok className="size-6" />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Twitter className="size-6" />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Linkedin className="size-6" />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Youtube className="size-6" />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Facebook className="size-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-12 space-x-2 text-center text-sm">
          <Link href="#" className="hover:text-gray-300">
            About Us
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-300">
            Blog
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-300">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-300">
            Cookie Policy
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-300">
            Guidelines
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-300">
            Contact Us
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-sm">
          © 2025 Event (PT Global Event Sejahtera)
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
