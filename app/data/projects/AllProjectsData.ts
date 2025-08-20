import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		slug: 'tournament-brackets-ai-assistant',
		title: 'Tournament Brackets AI Assistant',
		shortDescription: 'An AI-driven assistant for bracket predictions and tactical insights across college basketball tournaments, soccer, and other professional leagues.',
		description: `
			<p>The <strong>Multi-Tournament AI Assistant</strong> is your one-stop, data-driven bracket predictor and tactical adviser for tournaments like <strong>NCAA March Madness</strong>, NBA Playoffs, and the UEFA Champions League.</p>
			<p>Under the hood, it:</p>
			<ul>
			  <li><strong>Ingests real-time data</strong> (team form swings, injuries, lineup changes, live box scores).</li>
			  <li><strong>Models player & team analytics</strong>—offensive/defensive ratings, shooting streakiness, points-in-the-paint, rebounding, and mismatch factors.</li>
			  <li><strong>Offers "what-if" bracket simulations</strong> for March Madness, letting you explore alternative championship scenarios.</li>
			</ul>
		`,
		technologies: [
			'Machine Learning',
			'Model Context Protocol',
			'Python',
			'TypeScript',
			'Next.js',
			'React',
			'Sports Analytics'
		],
		year: 2025,
		category: 'AI/ML',
		demo: 'tournament-brackets-ai-assistant',
		blog: 'tournament-brackets-ai-assistant'
	},
	{
		slug: 'fantasy-manager-assistant',
		title: 'Fantasy Premier League Manager Assistant',
		shortDescription: 'An fantasy game co-manager that delivers transfer picks, lineup optimizations, and fixture insights in seconds without the busywork.',
		description: `
			<p>Fantasy Manager Assistant is your personal AI-powered FPL co-manager. It continuously ingests live Premier League data—player form, fixture difficulty, price changes—and runs it through advanced AI Agents using the Model Context Protocol.</p>
			<ul>
			  <li>Real-time analysis: Auto-update on form swings, injuries, and fixture shifts.</li>
			  <li>Transfer strategy: AI-driven ins and outs tailored to your budget and league.</li>
			  <li>Fixture forecasting: Predicted points and difficulty ratings for every gameweek.</li>
			</ul>
			<p>Spend less time crunching numbers and more time celebrating wins—Fantasy Manager Assistant handles the heavy lifting so you can dominate your league all season long.</p>
		`,
		technologies: [
			'Python', 
			'AI Agents', 
			'Model Context Protocol',
			'OpenAI', 
			'Anthropic'
		],
		year: 2025,
		category: 'AI/ML',
		demo: 'fantasy-manager-assistant'
		// No blog for this project yet
	},
];

export default AllProjectsData;
