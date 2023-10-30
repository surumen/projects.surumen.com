import { v4 as uuid } from 'uuid';

export const AllProjectsData = [
	{
		id: uuid(),
		category: 'graphql',
		image: '/images/course/course-graphql.jpg',
		title: 'GraphQL: introduction to graphQL for beginners',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Pending',
		level: 'Advance',
		duration: '2h 40m',
		rating: 2.5,
		recommended: true,
		popular: false,
		trending: false,
		progress: 95
	},
	{
		id: uuid(),
		category: 'Python',
		image: '/images/course/course-html.jpg',
		title: 'HTML Full Course - Build a Website Tutorial',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Pending',
		level: 'Beginner',
		duration: '3h 16m',
		rating: 3.0,
		recommended: false,
		popular: true,
		trending: true,
		progress: 55
	},
	{
		id: uuid(),
		category: 'javascript',
		image: '/images/course/course-javascript.jpg',
		title: 'A Complete Beginner’s Guide to JavaScript',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Advance',
		duration: '4h 10m',
		rating: 3.5,
		recommended: true,
		popular: true,
		trending: false,
		progress: 50
	},
	{
		id: uuid(),
		category: 'nodejs',
		image: '/images/course/course-node.jpg',
		title: 'Beginning Node.js, Express & MongoDB Development',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Intermediate',
		duration: '2h 00m',
		rating: 4.0,
		recommended: true,
		popular: true,
		trending: true,
		progress: 45
	},
	{
		id: uuid(),
		category: 'laravel',
		image: '/images/course/course-laravel.jpg',
		title:
			'Laravel: The Ultimate Beginner’s Guide to Learn Laravel Step by Step',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Beginner',
		duration: '1h 00m',
		rating: 4.5,
		recommended: true,
		popular: false,
		trending: true,
		progress: 65
	},
	{
		id: uuid(),
		category: 'react',
		image: '/images/course/course-react.jpg',
		title: 'How to easily create a website with React',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Advance',
		duration: '3h 55m',
		rating: 4.5,
		recommended: true,
		popular: true,
		trending: true,
		progress: 75
	},
	{
		id: uuid(),
		category: 'angular',
		image: '/images/course/course-angular.jpg',
		title: 'Angular - the complete guide for beginner',
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Pending',
		level: 'Intermediate',
		duration: '2h 46m',
		rating: 4.5,
		recommended: true,
		popular: true,
		trending: true,
		progress: 45
	},
	{
		id: uuid(),
		category: 'laravel',
		image: '/images/course/course-laravel.jpg',
		title:
			"Laravel: The Ultimate Beginner's Guide to Learn Laravel Step by Step",
		shortdescription:
			'Aliquam pulvinar eros a dictur vitae diam imperdiet, ornare turpis vequet elit nec, imperdiet lectuna liquam qs.',
		status: 'Live',
		level: 'Beginner',
		duration: '2h 46m',
		rating: 4.5,
		recommended: true,
		popular: true,
		trending: true,
		progress: 59
	}
];

export default AllProjectsData;
