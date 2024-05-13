import { v4 as uuid } from 'uuid';
import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		id: uuid(),
		languages: ['Typescript', 'Python'],
		frameworks: ['Next.js', 'Python'],
		technologyAreas: ['Python', 'Recurrent Neural Networks', 'Next.js'],
		title: 'March Madness Brackets Assistant',
		slug: 'march-madness-assistant',
		shortDescription:
			'Automated NCAA March Madness™ brackets assistant to beat the competition',
		status: 'Pending',
		level: 'Advanced',
		duration: '2h 40m',
		rating: 2.5,
		completed: '2024',
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>
        `,
		component: 'ncaa',
		contentType: 'app',
		hasWriteUp: true,
		content: ``
	},
	{
		id: uuid(),
		languages: ['Typescript'],
		frameworks: ['D3.js', 'Next.js'],
		technologyAreas: ['Next.js', 'D3.js'],
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
	{
		id: uuid(),
		languages: ['Python'],
		frameworks: ['Python'],
		technologyAreas: ['Python', 'Angular'],
		title: 'Patents Analytics: Explore Focus Areas for Innovation based on Publicly Available Data',
		slug: 'patent-analytics',
		shortDescription:
			'Segment and track player performances, and identify squad depth players in different leagues.',
		status: 'Pending',
		level: 'Advanced',
		duration: '2h 40m',
		rating: 2.5,
		completed: '2018',
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>
        `,
		contentType: 'demo',
		hasWriteUp: false,
		content: ``
	}
];

export default AllProjectsData;
