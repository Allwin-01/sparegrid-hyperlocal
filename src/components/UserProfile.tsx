'use client';
import React from 'react';
import {
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
	PopoverFooter,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile({ user, onSignOut, children }: { user: any, onSignOut?: () => void, children?: React.ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				{children || (
					<Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-white/10">
						<Avatar className="h-8 w-8 border border-white/10">
							<AvatarImage src={user?.photoURL || "https://avatar.vercel.sh/128"} />
							<AvatarFallback className="bg-brand-orange text-white">{user?.displayName?.[0] || 'U'}</AvatarFallback>
						</Avatar>
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className='w-64 bg-brand-charcoal/90 backdrop-blur-xl border-white/10 text-white'>
				<PopoverHeader className="border-white/10">
					<div className="flex items-center space-x-3">
						<Avatar className="h-10 w-10 border border-white/10">
							<AvatarImage src={user?.photoURL || "https://avatar.vercel.sh/128"} />
							<AvatarFallback className="bg-brand-orange text-white">{user?.displayName?.[0] || 'U'}</AvatarFallback>
						</Avatar>
						<div className="overflow-hidden">
							<PopoverTitle className="text-white truncate">{user?.displayName || 'John Doe'}</PopoverTitle>
							<PopoverDescription className='text-xs text-white/60 truncate'>{user?.email || 'john.doe@example.com'}</PopoverDescription>
						</div>
					</div>
				</PopoverHeader>
				<PopoverBody className="space-y-1 px-2 py-2">
					<Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5" size="sm">
						<User className="mr-2 h-4 w-4" />
						View Profile
					</Button>
					<Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5" size="sm">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</Button>
				</PopoverBody>
				<PopoverFooter className="border-white/10 p-2">
					<Button 
            variant="outline" 
            className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-brand-orange" 
            size="sm"
            onClick={onSignOut}
          >
						<LogOut className="mr-2 h-4 w-4" />
						Sign Out
					</Button>
				</PopoverFooter>
			</PopoverContent>
		</Popover>
	);
}
