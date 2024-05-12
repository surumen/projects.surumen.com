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
			'Creating interactive dashboards and data visualizations with D3.JS and Next.JS.',
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
		contentType: 'app',
		component: 'fpl',
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
		content: ``
	}
];

export default AllProjectsData;
