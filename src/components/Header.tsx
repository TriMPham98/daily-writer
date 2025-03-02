"use client";

import React from "react";
import Link from "next/link";
import { FaPencilAlt, FaChartBar } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Daily Writer
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                <FaPencilAlt className="mr-1.5" />
                Write
              </Link>

              <Link
                href="/stats"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                <FaChartBar className="mr-1.5" />
                Stats
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
