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
		shortDescription: 'An AI-driven assistant for bracket predictions and tactical insights across college basketball tournaments, soccer, and other professional leagues.',
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
		hasBlog: true,
		content: ``
	},
	{
		id: uuid(),
		languages: ['Typescript'],
		frameworks: ['D3.js'],
		technologyAreas: ['D3.js', 'Next.js'],
		title: 'Data Visualization with D3 and Next.js',
		slug: 'data-visualizations-d3',
		shortDescription:
			'Creating interactive dashboards and data visualizations with D3.js and Next.js.',
		status: 'Pending',
		level: 'Advanced',
		duration: '2h 40m',
		rating: 2.5,
		completed: '2024',
		description: `<p>Effective data visualization is a crucial part of any data-driven application.
		It helps users to easily make sense of complex data in a visual format with effective interactions.
		</p>
		<p>
		<b>Data Driven Documents</b> JS aka <a target='_blank' rel='noreferrer' href='https://d3js.org/'>D3.js</a> provides powerful visualization components, and a data-driven
		approach to DOM manipulation. When you combine this with Next.js virtual DOM and component-based architecture,
		you can write more concise and readable code, and share logic across components with ease.
		</p>
        `,
		hasDemo: true,
		hasBlog: false,
		content: ``
	},
];

export default AllProjectsData;
