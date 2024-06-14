import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useLocation } from "react-router-dom";
const navigation = [
  { name: 'Buy', href: '/', current: true },
  { name: 'Sell/Rent', href: '/register', current: false },
  { name: ' Transaction', href: '/transaction', current: false },
  { name: 'Your Properties', href: '/property/:id', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Disclosure as="nav" className="bg-yellow-500 border-yellow-700 w-screen">
      {({ open }) => (
        <>
          <div className="flex justify-between items-center mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/assets/logo.svg" className="h-10 rounded-full border-4 border-black " alt="LandRise" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                <img src="/assets/lansol.svg" alt="" />
              </span>
            </a>
            <div className="md:hidden">
              {open ? (
                <Disclosure.Button className="inline-flex items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Close main menu</span>
                </Disclosure.Button>
              ) : (
                <Disclosure.Button className="inline-flex items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  <Bars3Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Open main menu</span>
                </Disclosure.Button>
              )}
            </div>
            <div className="hidden md:flex md:w-auto md:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current ? 'text-blue-700 font-medium' : 'text-gray-900 hover:text-blue-700',
                    'block px-3 py-2 rounded'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="relative">
              {id ? id :
                <button onClick={toggleDropdown} className="flex items-center justify-center bg-[#F90] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ease-in-out hover:bg-blue-600">
                  Login

                </button>}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-lg z-10">
                  <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">User</a>
                  <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Admin</a>
                  <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Register</a>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="border-t border-gray-200 py-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current ? 'text-blue-700 font-medium' : 'text-gray-900 hover:text-blue-700',
                    'block px-3 py-2'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}

            </div>

          </Disclosure.Panel>
        </>
      )}

    </Disclosure>
  )
}
