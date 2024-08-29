import Link from 'next/link'

import { NavbarLinks } from './NavbarLinks'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/button'

export async function Navbar() {
	return (
		<nav className='relative max-w-7xl w-full flex md:grid md:grid-cols-12 items-center px-4 md:px-8 mx-auto py-7'>
			<div className='md:col-span-3'>
				<Link href='/'>
					<h1 className='text-2xl font-semibold '>
						Marshal<span className='text-primary'>UI</span>
					</h1>
				</Link>
			</div>

			<NavbarLinks />

			<div className='flex items-center gap-x-2 ms-auto md:col-span-3'>
				<Button>Login</Button>
				<Button variant='secondary'>Register</Button>
			</div>

			<div className='md:hidden'>
				<MobileMenu />
			</div>
		</nav>
	)
}
