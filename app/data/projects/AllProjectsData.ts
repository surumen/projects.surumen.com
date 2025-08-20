import { v4 as uuid } from 'uuid';
import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		id: uuid(),
		languages: ['Typescript', 'Python'],
		frameworks: [
			'Next.js',
			'React',
			'AI Agents',
			'Model Context Protocol',
			'OpenAI',
			'Anthropic'
		],
		technologyAreas: [
			'Model Context Protocol',
			'AI Agents',
			'Anthropic',
			'OpenAI',
			'Machine Learning',
			'Sports Analytics'
		],
		shortTitle: 'Tournament Brackets AI Assistant',
		title: 'Tournament Brackets AI Assistant',
		slug: 'tournament-brackets-ai-assistant',
		shortDescription: 'An AI-driven assistant for bracket predictions and tactical insights across college basketball tournaments, soccer, and other professional leagues. Features a modernized bracket system with 52% smaller bundle size.',
		status: 'Pending',
		level: 'Advanced',
		rating: 5.0,
		completed: '2025',
		description: `
			<p>The <strong>Multi-Tournament AI Assistant</strong> is your one-stop, data-driven bracket predictor and tactical adviser for tournaments like <strong>NCAA March Madness</strong>, NBA Playoffs, and the UEFA Champions League.</p>
			<p>Under the hood, it:</p>
			<ul>
			  <li><strong>Ingests real-time data</strong> (team form swings, injuries, lineup changes, live box scores).</li>
			  <li><strong>Models player & team analytics</strong>—offensive/defensive ratings, shooting streakiness, points-in-the-paint, rebounding, and mismatch factors.</li>
			  <li><strong>Offers “what-if” bracket simulations</strong> for March Madness, letting you explore alternative championship scenarios.</li>
			</ul>
		`,
		hasDemo: true,
		hasBlog: true,
		content: ``
	},
	{
		id: uuid(),
		languages: ['Typescript', 'Python'],
		frameworks: ['AI Agents', 'Model Context Protocol','OpenAI', 'Anthropic'],
		technologyAreas: ['Model Context Protocol', 'AI Agents', 'Anthropic', 'OpenAI', 'Python'],
		shortTitle: 'Fantasy Manager Assistant',
		title: 'Fantasy Premier League Manager Assistant',
		slug: 'fantasy-manager-assistant',
		shortDescription: 'An fantasy game co-manager that delivers transfer picks, lineup optimizations, and fixture insights in seconds without the busywork.',
		status: 'Pending',
		level: 'Advanced',
		rating: 5.0,
		completed: '2025',
		description: `
			<p>Fantasy Manager Assistant is your personal AI-powered FPL co-manager. It continuously ingests live Premier League data—player form, fixture difficulty, price changes—and runs it through advanced AI Agents using the Model Context Protocol.</p>
			<ul>
			  <li>Real-time analysis: Auto-update on form swings, injuries, and fixture shifts.</li>
			  <li>Transfer strategy: AI-driven ins and outs tailored to your budget and league.</li>
			  <li>Fixture forecasting: Predicted points and difficulty ratings for every gameweek.</li>
			</ul>
			<p>Spend less time crunching numbers and more time celebrating wins—Fantasy Manager Assistant handles the heavy lifting so you can dominate your league all season long.</p>
		`,
		hasDemo: true,
		hasBlog: false,
		content: ``
	},
];

export default AllProjectsData;
