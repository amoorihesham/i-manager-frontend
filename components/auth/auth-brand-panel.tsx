export function AuthBrandPanel() {
	return (
		<div className='relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary/60 p-10 text-primary-foreground'>
			{/* Background decorative circles */}
			<div className='absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10' />
			<div className='absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/5' />
			<div className='absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-white/5' />

			{/* Logo / product name */}
			<div className='relative z-10 flex items-center gap-2'>
				<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/20'>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='h-5 w-5'>
						<rect
							x='3'
							y='3'
							width='7'
							height='7'
							rx='1'
						/>
						<rect
							x='14'
							y='3'
							width='7'
							height='7'
							rx='1'
						/>
						<rect
							x='3'
							y='14'
							width='7'
							height='7'
							rx='1'
						/>
						<rect
							x='14'
							y='14'
							width='7'
							height='7'
							rx='1'
						/>
					</svg>
				</div>
				<span className='text-lg font-semibold tracking-tight'>iManager</span>
			</div>

			{/* Central illustration */}
			<div className='relative z-10 flex flex-col items-center justify-center py-12'>
				<div className='mb-8 flex items-center justify-center'>
					<svg
						viewBox='0 0 200 160'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-64 opacity-90'>
						{/* Task board illustration */}
						<rect
							x='20'
							y='20'
							width='160'
							height='120'
							rx='12'
							fill='white'
							fillOpacity='0.15'
						/>
						<rect
							x='34'
							y='38'
							width='40'
							height='88'
							rx='6'
							fill='white'
							fillOpacity='0.2'
						/>
						<rect
							x='82'
							y='38'
							width='40'
							height='88'
							rx='6'
							fill='white'
							fillOpacity='0.2'
						/>
						<rect
							x='130'
							y='38'
							width='40'
							height='88'
							rx='6'
							fill='white'
							fillOpacity='0.2'
						/>
						{/* Cards */}
						<rect
							x='38'
							y='48'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.5'
						/>
						<rect
							x='38'
							y='72'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.4'
						/>
						<rect
							x='38'
							y='96'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.3'
						/>
						<rect
							x='86'
							y='48'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.5'
						/>
						<rect
							x='86'
							y='72'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.35'
						/>
						<rect
							x='134'
							y='48'
							width='32'
							height='18'
							rx='4'
							fill='white'
							fillOpacity='0.45'
						/>
					</svg>
				</div>
			</div>

			{/* Tagline */}
			<div className='relative z-10 space-y-2'>
				<h2 className='text-2xl font-bold leading-tight'>
					Manage projects,
					<br />
					deliver results.
				</h2>
				<p className='text-sm text-primary-foreground/70'>
					Collaborate with your team, track progress, and ship on time — all in one place.
				</p>
			</div>
		</div>
	);
}
