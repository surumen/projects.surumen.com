import { v4 as uuid } from 'uuid';
import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		id: uuid(),
		languages: ['Typescript', 'Python'],
		frameworks: ['AI Agents', 'Model Context Protocol','OpenAI', 'Anthropic'],
		technologyAreas: ['Model Context Protocol', 'AI Agents', 'Anthropic', 'OpenAI', 'Python'],
		shortTitle: 'Fantasy Manager Assistant',
		title: 'Fantasy Premier League Manager Assistant',
		slug: 'fantasy-manager-assistant',
		shortDescription: 'An AI-driven FPL co-manager that delivers transfer picks, lineup optimizations, and fixture insights in seconds without the busywork.',
		status: 'Pending',
		level: 'Advanced',
		duration: '2h 40m',
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
		contentType: 'app',
		component: 'fplAssistant',
		hasWriteUp: false,
		content: ``
	},
	{
		id: uuid(),
		languages: ['Typescript', 'Python'],
		frameworks: ['Machine Learning', 'Python'],
		technologyAreas: ['Recurrent Neural Networks', 'Feature Selection', 'Next.js', 'Python'],
		title: 'March Madness Brackets Assistant',
		slug: 'march-madness-assistant',
		shortDescription:
			'Automated NCAA March Madness™ brackets assistant to beat the competition',
		status: 'Pending',
		level: 'Advanced',
		duration: '2h 40m',
		rating: 2.5,
		completed: '2024',
		description: `<p>If you are a basketball fan, or just relish the competition with your friends, 
		you're likely to spend quite some time every spring strategizing, and trying to crunch some complicated data 
		(unless if you don't mind losing a few bucks and coming last in your bracket).</p>
		<p>&nbsp;&nbsp;</p>
		<p>The odds of predicting a perfect bracket are an astronomical 1 in 9,223,372 billion.
		That said, with the available data every year, it is still possible to somewhat predict a decent number of games 
		based on each team's season statistics.</p>
        `,
		component: 'ncaa',
		contentType: 'app',
		hasWriteUp: false,
		content: ``
	},
	{
		id: uuid(),
		languages: ['Typescript'],
		frameworks: ['D3.js'],
		technologyAreas: ['D3.js', 'Next.js'],
		title: 'Data Visualization with D3 and Next.js',
		slug: 'data-visualization-d3-next-js',
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
		contentType: 'app',
		component: 'fpl',
		hasWriteUp: false,
		content: ``
	},
];

export default AllProjectsData;
