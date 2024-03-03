import { v4 as uuid } from 'uuid';
import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		id: uuid(),
		language: 'Python',
		technologyAreas: ['Python', 'Recurrent Neural Networks'],
		title: 'Predictive Analysis: Fantasy Football Players Power Index',
		slug: 'fantasy-football-power-index',
		shortDescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Pending',
		level: 'Advance',
		duration: '2h 40m',
		rating: 2.5,
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>
        `,
		contentType: 'blog',
		content: ``
	},
	{
		id: uuid(),
		language: 'Python',
		technologyAreas: ['Python', 'Recurrent Neural Networks'],
		title: 'March Madness Simulator - 2024 College Basketball',
		slug: 'march-madness',
		shortDescription:
			'An alternative to collaborative filtering. Using reinforcement learning to recommend songs',
		status: 'Pending',
		level: 'Advance',
		duration: '2h 40m',
		rating: 2.5,
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>
        `,
		component: 'tournament',
		contentType: 'app',
		content: ``
	},
];

export default AllProjectsData;
