import React from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, DropdownItem, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  const path = useLocation().pathname;
  return (
    <>
      <Navbar className='sticky top-0 z-50 bg-white border-b-2 md:flex md:items-center md:justify-between'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold '>
          <span className='px-3 py-2 bg-gradient-to-r from-blue-500 via-purple-400 to-blue-400 rounded-lg text-white'>Ram's</span>
          Blog
        </Link>
        <form>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
          <Button className=' w-12 h-10 hidden sm:inline' color='gray' pill>
            <FaMoon />
          </Button>
          {
            currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline label={
                  <Avatar alt='user' img={currentUser.profilePicture} rounded />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>@{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                  <DropdownDivider />
                  <DropdownItem>Sign out </DropdownItem>
                </Link>
              </Dropdown>
            ) :
              (
                <Link to='/sign-in' >
                  <Button gradientDuoTone='purpleToBlue' outline >Sign In</Button>
                </Link>
              )
          }

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={'div'} >
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={'div'} >
            <Link to='/projects'>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
export default Header;
