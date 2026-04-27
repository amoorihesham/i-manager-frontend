import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, CheckSquare, Users, BarChart3, Zap, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/* ── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: 'iManager',
	applicationCategory: 'BusinessApplication',
	operatingSystem: 'Web',
	description: 'Unified project management platform with kanban boards, task tracking, and team collaboration.',
	offers: [
		{ '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
		{
			'@type': 'Offer',
			name: 'Pro',
			price: '12',
			priceCurrency: 'USD',
			billingIncrement: 'P1M',
		},
		{
			'@type': 'Offer',
			name: 'Team',
			price: '29',
			priceCurrency: 'USD',
			billingIncrement: 'P1M',
		},
	],
};

/* ── PAGE ───────────────────────────────────────────────────────────────── */

export default function Home() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* HEADER */}
			<header className='sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm'>
				<div className='mx-auto max-w-6xl px-6 h-14 flex items-center justify-between'>
					<BrandLogo />
					<div className='flex items-center gap-2'>
						<Button
							variant='ghost'
							size='sm'
							asChild>
							<a href='/login'>Sign in</a>
						</Button>
						<Button
							size='sm'
							asChild>
							<a href='/register'>Get started</a>
						</Button>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				{/* ── HERO ──────────────────────────────────────────────────── */}
				<section
					aria-labelledby='hero-heading'
					className='relative overflow-hidden border-b border-border/30'>
					{/* dot grid texture */}
					<div
						className='absolute inset-0 pointer-events-none select-none'
						style={{
							backgroundImage: 'radial-gradient(circle, oklch(0.6 0 0 / 0.09) 1px, transparent 1px)',
							backgroundSize: '28px 28px',
						}}
						aria-hidden='true'
					/>
					{/* gradient fade over grid */}
					<div
						className='absolute inset-0 pointer-events-none'
						style={{
							background: 'radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, var(--background) 75%)',
						}}
						aria-hidden='true'
					/>

					<div className='relative mx-auto max-w-6xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32'>
						<div className='grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center'>
							{/* copy */}
							<div>
								<div
									className='animate-in fade-in slide-in-from-bottom-3 duration-500 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-medium text-muted-foreground mb-6'
									style={{ animationFillMode: 'backwards' }}>
									<span className='size-1.5 rounded-full bg-foreground/50' />
									Now in public beta
								</div>

								<h1
									id='hero-heading'
									className='animate-in fade-in slide-in-from-bottom-4 duration-500 text-5xl sm:text-[3.5rem] lg:text-[4rem] font-bold tracking-tight leading-[1.1] mb-5'
									style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
									Manage projects,
									<br />
									<span className='text-muted-foreground'>deliver results.</span>
								</h1>

								<p
									className='animate-in fade-in slide-in-from-bottom-4 duration-500 text-lg text-muted-foreground leading-relaxed mb-8 max-w-120'
									style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
									iManager brings kanban boards, task tracking, and team collaboration into one focused workspace — so
									your team ships instead of syncing.
								</p>

								<div
									className='animate-in fade-in slide-in-from-bottom-3 duration-500 flex flex-col sm:flex-row gap-3 mb-12'
									style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}>
									<Button
										size='lg'
										asChild
										className='gap-2'>
										<a href='/register'>
											Start for free
											<ArrowRight className='size-4' />
										</a>
									</Button>
									<Button
										size='lg'
										variant='outline'
										asChild>
										<a href='#features'>See features</a>
									</Button>
								</div>

								{/* social proof */}
								<div
									className='animate-in fade-in duration-700 flex items-center gap-3 text-sm text-muted-foreground'
									style={{ animationDelay: '380ms', animationFillMode: 'backwards' }}>
									<div className='flex -space-x-1.5'>
										{AVATAR_COLORS.map((bg, i) => (
											<div
												key={i}
												className='size-6 rounded-full border-2 border-background'
												style={{ background: bg }}
											/>
										))}
									</div>
									<span>
										Trusted by <strong className='text-foreground font-semibold'>2,400+</strong> teams
									</span>
									<span className='text-border'>·</span>
									<span>Free to start</span>
								</div>
							</div>

							{/* product mockup */}
							<div
								className='animate-in fade-in zoom-in-[0.97] duration-700 hidden lg:block'
								style={{ animationDelay: '220ms', animationFillMode: 'backwards' }}>
								<KanbanMockup />
							</div>
						</div>
					</div>
				</section>

				{/* ── FEATURES ──────────────────────────────────────────────── */}
				<section
					id='features'
					aria-labelledby='features-heading'
					className='py-24 border-b border-border/30'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='text-center mb-16'>
							<p className='text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3'>Features</p>
							<h2
								id='features-heading'
								className='text-3xl sm:text-4xl font-bold tracking-tight mb-4'>
								Everything your team needs
							</h2>
							<p className='text-muted-foreground text-lg max-w-lg mx-auto'>
								One platform that replaces five scattered tools. Built for teams that ship.
							</p>
						</div>

						<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{FEATURES.map((f, i) => (
								<FeatureCard
									key={f.title}
									feat={f}
									index={i}
								/>
							))}
						</div>
					</div>
				</section>

				{/* ── HOW IT WORKS ──────────────────────────────────────────── */}
				<section
					id='how-it-works'
					aria-labelledby='how-heading'
					className='py-24 bg-muted/30 border-b border-border/30'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='text-center mb-16'>
							<p className='text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3'>Process</p>
							<h2
								id='how-heading'
								className='text-3xl sm:text-4xl font-bold tracking-tight mb-4'>
								Up and running in minutes
							</h2>
							<p className='text-muted-foreground text-lg max-w-lg mx-auto'>
								No complex onboarding. Sign up and start managing your first project today.
							</p>
						</div>

						<div className='grid sm:grid-cols-3 gap-8 relative'>
							{/* connecting rule */}
							<div
								className='hidden sm:block absolute top-7 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-border'
								aria-hidden='true'
							/>
							{STEPS.map((s, i) => (
								<StepCard
									key={s.title}
									step={s}
									index={i}
								/>
							))}
						</div>
					</div>
				</section>

				{/* ── PRICING ───────────────────────────────────────────────── */}
				<section
					id='pricing'
					aria-labelledby='pricing-heading'
					className='py-24 border-b border-border/30'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='text-center mb-16'>
							<p className='text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3'>Pricing</p>
							<h2
								id='pricing-heading'
								className='text-3xl sm:text-4xl font-bold tracking-tight mb-4'>
								Simple, transparent pricing
							</h2>
							<p className='text-muted-foreground text-lg max-w-lg mx-auto'>
								Start free, scale when you grow. Annual billing saves 20%.
							</p>
						</div>

						<div className='grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto'>
							{PRICING.map((tier) => (
								<PricingCard
									key={tier.name}
									tier={tier}
								/>
							))}
						</div>
					</div>
				</section>

				{/* ── CTA BANNER ────────────────────────────────────────────── */}
				<section
					aria-label='Get started'
					className='py-24'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='rounded-2xl border border-border bg-muted/40 px-8 py-16 text-center'>
							<h2 className='text-3xl sm:text-4xl font-bold tracking-tight mb-4'>Ready to ship faster?</h2>
							<p className='text-muted-foreground text-lg mb-8 max-w-md mx-auto'>
								Join 2,400+ teams who replaced scattered tools with iManager. No credit card required.
							</p>
							<Button
								size='lg'
								asChild
								className='gap-2'>
								<a href='/register'>
									Start for free
									<ArrowRight className='size-4' />
								</a>
							</Button>
						</div>
					</div>
				</section>
			</main>

			{/* FOOTER */}
			<footer className='border-t border-border/50 py-14'>
				<div className='mx-auto max-w-6xl px-6'>
					<div className='flex flex-col md:flex-row justify-between gap-10 mb-10'>
						<div className='max-w-55'>
							<BrandLogo />
							<p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
								Manage projects, deliver results. Built for teams that care about shipping.
							</p>
						</div>

						<div className='grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm'>
							{FOOTER_LINKS.map((col) => (
								<div key={col.heading}>
									<h3 className='font-semibold mb-3 text-sm'>{col.heading}</h3>
									<ul className='space-y-2.5'>
										{col.links.map((link) => (
											<li key={link}>
												<a
													href='#'
													className='text-muted-foreground hover:text-foreground transition-colors'>
													{link}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>

					<div className='border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground'>
						<span>© 2026 iManager. All rights reserved.</span>
						<div className='flex gap-5'>
							{['Privacy', 'Terms', 'Cookies'].map((l) => (
								<a
									key={l}
									href='#'
									className='hover:text-foreground transition-colors'>
									{l}
								</a>
							))}
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}

/* ── COMPONENTS ─────────────────────────────────────────────────────────── */

function BrandLogo() {
	return (
		<Link
			href='/'
			className='flex items-center gap-2 group'>
			<div className='size-7 rounded-md bg-foreground flex items-center justify-center shrink-0 group-hover:opacity-80 transition-opacity'>
				<svg
					viewBox='0 0 20 20'
					fill='currentColor'
					className='size-3.5 text-background'>
					<rect
						x='2'
						y='2'
						width='6.5'
						height='6.5'
						rx='1.5'
					/>
					<rect
						x='11.5'
						y='2'
						width='6.5'
						height='6.5'
						rx='1.5'
					/>
					<rect
						x='2'
						y='11.5'
						width='6.5'
						height='6.5'
						rx='1.5'
					/>
					<rect
						x='11.5'
						y='11.5'
						width='6.5'
						height='6.5'
						rx='1.5'
					/>
				</svg>
			</div>
			<span className='text-[15px] font-semibold tracking-tight'>iManager</span>
		</Link>
	);
}

function KanbanMockup() {
	const cols: {
		label: string;
		count: number;
		active?: boolean;
		cards: { title: string; tag: string; pct?: number }[];
	}[] = [
		{
			label: 'Backlog',
			count: 3,
			cards: [
				{ title: 'Update onboarding flow', tag: 'Design' },
				{ title: 'API rate limiting', tag: 'Dev' },
			],
		},
		{
			label: 'In Progress',
			count: 2,
			active: true,
			cards: [
				{ title: 'Dashboard redesign', tag: 'Design', pct: 65 },
				{ title: 'Analytics module', tag: 'Dev', pct: 40 },
			],
		},
		{
			label: 'Done',
			count: 5,
			cards: [
				{ title: 'CI/CD pipeline setup', tag: 'Infra' },
				{ title: 'Component library', tag: 'Design' },
			],
		},
	];

	return (
		<div className='rounded-xl border border-border bg-card shadow-lg overflow-hidden ring-1 ring-border/50'>
			{/* window chrome */}
			<div className='flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50'>
				{['bg-destructive/40', 'bg-yellow-400/60', 'bg-green-500/50'].map((c) => (
					<div
						key={c}
						className={`size-2.5 rounded-full ${c}`}
					/>
				))}
				<span className='ml-3 text-xs text-muted-foreground font-mono'>Q2 Sprint · Design System</span>
			</div>

			{/* board */}
			<div className='flex gap-3 p-4'>
				{cols.map((col) => (
					<div
						key={col.label}
						className='flex-1 min-w-0'>
						<div className='flex items-center gap-1.5 mb-3'>
							<div className={`size-1.5 rounded-full ${col.active ? 'bg-foreground' : 'bg-border'}`} />
							<span className='text-[11px] font-medium text-muted-foreground'>{col.label}</span>
							<span className='ml-auto text-[10px] text-muted-foreground/60 tabular-nums'>{col.count}</span>
						</div>
						<div className='space-y-2'>
							{col.cards.map((card) => (
								<div
									key={card.title}
									className='rounded-lg border border-border bg-background p-2.5 hover:shadow-sm transition-shadow'>
									<p className='text-[11px] font-medium text-foreground leading-snug mb-2'>{card.title}</p>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium'>
											{card.tag}
										</span>
										{card.pct != null && (
											<div className='flex items-center gap-1'>
												<div className='w-10 h-0.75 rounded-full bg-border overflow-hidden'>
													<div
														className='h-full rounded-full bg-foreground/50'
														style={{ width: `${card.pct}%` }}
													/>
												</div>
												<span className='text-[9px] text-muted-foreground tabular-nums'>{card.pct}%</span>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* footer bar */}
			<div className='flex items-center gap-6 px-4 py-2.5 border-t border-border bg-muted/30'>
				{[
					['24', 'tasks'],
					['8', 'done'],
					['87%', 'on track'],
				].map(([v, l]) => (
					<div
						key={l}
						className='flex items-baseline gap-1'>
						<span className='text-xs font-semibold tabular-nums'>{v}</span>
						<span className='text-[9px] text-muted-foreground'>{l}</span>
					</div>
				))}
				<div className='ml-auto flex -space-x-1'>
					{AVATAR_COLORS.slice(0, 3).map((bg, i) => (
						<div
							key={i}
							className='size-4 rounded-full border border-background'
							style={{ background: bg }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function FeatureCard({ feat, index }: { feat: (typeof FEATURES)[0]; index: number }) {
	return (
		<Card
			className='animate-in fade-in slide-in-from-bottom-3 duration-500 group border-border/60 hover:-translate-y-0.5 transition-transform'
			style={{
				animationDelay: `${index * 60 + 100}ms`,
				animationFillMode: 'backwards',
			}}>
			<CardContent className='p-5'>
				<div className='size-9 rounded-lg border border-border bg-muted flex items-center justify-center mb-4'>
					<feat.Icon className='size-4 text-foreground' />
				</div>
				<h3 className='font-semibold mb-1.5 text-sm'>{feat.title}</h3>
				<p className='text-sm text-muted-foreground leading-relaxed'>{feat.desc}</p>
			</CardContent>
		</Card>
	);
}

function StepCard({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
	return (
		<div className='flex flex-col items-center text-center'>
			<div className='size-14 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-base font-mono mb-5 shrink-0 relative z-10'>
				0{index + 1}
			</div>
			<h3 className='font-semibold mb-2'>{step.title}</h3>
			<p className='text-sm text-muted-foreground leading-relaxed'>{step.desc}</p>
		</div>
	);
}

function PricingCard({ tier }: { tier: (typeof PRICING)[0] }) {
	return (
		<Card
			className={
				tier.popular ? 'border-foreground/25 shadow-md ring-1 ring-foreground/10 relative' : 'border-border/60'
			}>
			{tier.popular && (
				<div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-semibold px-3 py-1 rounded-full whitespace-nowrap'>
					Most Popular
				</div>
			)}
			<CardContent className='p-6 flex flex-col h-full'>
				<div className='mb-5'>
					<p className='text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2'>{tier.name}</p>
					<div className='flex items-baseline gap-1 mb-2'>
						<span className='text-3xl font-bold tracking-tight'>${tier.price}</span>
						<span className='text-sm text-muted-foreground'>{tier.suffix}</span>
					</div>
					<p className='text-sm text-muted-foreground'>{tier.desc}</p>
				</div>

				<ul className='space-y-2.5 mb-6 flex-1'>
					{tier.perks.map((p) => (
						<li
							key={p}
							className='flex items-center gap-2.5 text-sm'>
							<Check className='size-3.5 shrink-0 text-foreground' />
							<span className='text-muted-foreground'>{p}</span>
						</li>
					))}
				</ul>

				<Button
					variant={tier.popular ? 'default' : 'outline'}
					asChild
					className='w-full'>
					<a href={tier.href}>{tier.cta}</a>
				</Button>
			</CardContent>
		</Card>
	);
}

/* ── DATA ────────────────────────────────────────────────────────────────── */

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#059669', '#D97706'];

const FEATURES: { Icon: LucideIcon; title: string; desc: string }[] = [
	{
		Icon: LayoutDashboard,
		title: 'Kanban Boards',
		desc: 'Visualise your workflow with flexible, drag-and-drop boards. Customise columns and track status at a glance.',
	},
	{
		Icon: CheckSquare,
		title: 'Task Tracking',
		desc: 'Break projects into actionable tasks with due dates, priorities, and assignments. Never miss a deadline.',
	},
	{
		Icon: Users,
		title: 'Team Collaboration',
		desc: 'Invite teammates, assign roles, comment on tasks, and keep everyone aligned in real time.',
	},
	{
		Icon: BarChart3,
		title: 'Progress Analytics',
		desc: 'Velocity charts, burndowns, and bottleneck detection. Know exactly where your project stands.',
	},
	{
		Icon: Zap,
		title: 'Automations',
		desc: 'Set rules to auto-assign cards, trigger notifications, and move tasks when conditions are met.',
	},
	{
		Icon: ShieldCheck,
		title: 'Enterprise Security',
		desc: 'SOC 2 compliant, SSO/SAML, role-based permissions, and full audit logs for compliance teams.',
	},
];

const STEPS = [
	{
		title: 'Create your workspace',
		desc: 'Sign up and create a workspace in seconds. Add your first project and name a board right away.',
	},
	{
		title: 'Add tasks & invite team',
		desc: 'Populate your board with tasks, set priorities and due dates, then invite teammates via email or link.',
	},
	{
		title: 'Track & deliver',
		desc: 'Move cards as work progresses. Watch analytics update in real time and hit every deadline.',
	},
];

const PRICING = [
	{
		name: 'Free',
		price: 0,
		suffix: '/ forever',
		desc: 'For individuals and small teams getting started.',
		perks: ['3 projects', '5 team members', 'Basic kanban boards', 'Task management', 'Mobile app'],
		cta: 'Get started free',
		href: '/register',
		popular: false,
	},
	{
		name: 'Pro',
		price: 12,
		suffix: '/ month',
		desc: 'For growing teams that need power and insights.',
		perks: [
			'Unlimited projects',
			'20 team members',
			'Advanced analytics',
			'Priority support',
			'Custom workflows',
			'Time tracking',
		],
		cta: 'Start Pro trial',
		href: '/register?plan=pro',
		popular: true,
	},
	{
		name: 'Team',
		price: 29,
		suffix: '/ month',
		desc: 'Enterprise-grade controls for large organisations.',
		perks: [
			'Everything in Pro',
			'Unlimited members',
			'SSO & SAML',
			'Admin controls',
			'Custom integrations',
			'Audit logs',
		],
		cta: 'Contact sales',
		href: '/register?plan=team',
		popular: false,
	},
];

const FOOTER_LINKS = [
	{ heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
	{ heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
	{ heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
];
