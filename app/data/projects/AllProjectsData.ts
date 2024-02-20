import { v4 as uuid } from 'uuid';
import { Project } from '@/types';

export const AllProjectsData: Project[] = [
	{
		id: uuid(),
		language: 'Python',
		technologyAreas: ['Python', 'Recurrent Neural Networks'],
		image: '/images/course/course-graphql.jpg',
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
		image: '/images/course/course-graphql.jpg',
		title: 'Building a Music Playlist Generator',
		slug: 'mixtape-generator',
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
		contentType: 'app',
		content: ``
	},
	{
		id: uuid(),
		language: 'C++',
		technologyAreas: ['CNN'],
		image: '/images/course/course-html.jpg',
		title: 'Image Classification using Convolutional Neural Networks',
		slug: 'image-classification-cnn',
		shortDescription:
			'Applying different performance optimization techniques on a pre-trained Convolutional Neural Network to classify large datasets',
		status: 'Pending',
		level: 'Beginner',
		duration: '3h 16m',
		rating: 3.0,
		description: `<p>In this project, we apply different performance optimization techniques on a pre-trained Convolutional Neural Network to classify 32x32 images into 10 technologyAreas</p>
        <p>We focus on these three techniques; vectorization with SIMD instructions, parallelism with OpenMP, speed up calculations using Amdahl's Law, and benchmark the performance improvement 
        achieved with each.</p>
        `,
		contentType: 'app',
		content: ``
	},
	{
		id: uuid(),
		language: 'C',
		technologyAreas: ['Deep Learning'],
		image: '/images/course/course-javascript.jpg',
		title: 'Video Processing: Separating foreground and background information from a video',
		slug: 'video-processor',
		shortDescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Advance',
		duration: '4h 10m',
		rating: 3.5,
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>`,
		contentType: 'app',
		content: ``
	},
	{
		id: uuid(),
		language: 'Go',
		technologyAreas: ['NodeJS'],
		image: '/images/course/course-node.jpg',
		title: 'Mini Cryptocurrency',
		slug: 'crypto',
		shortDescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Intermediate',
		duration: '2h 00m',
		rating: 4.0,
		description: `<p>We'll dive into GraphQL, the fundamentals of GraphQL. 
        We're only gonna use the pieces of it that we need to build in Gatsby. 
        We're not gonna be doing a deep dive into what GraphQL is or the language specifics. 
        We're also gonna get into MDX. MDX is a way to write React components in your markdown.</p>`,
		contentType: 'app',
		content: ``
	},
];

export default AllProjectsData;
