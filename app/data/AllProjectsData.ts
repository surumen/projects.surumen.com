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
		content: `
		<section class='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
			<div class='row'>
				<div class='col-lg-3'>
					<ul class='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-1'>
								Introduction
							</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-3'>Restrictions</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-4'>Your Content</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-5'>No warranties</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
						</li>
					</ul>
				</div>
				<div class='col-lg overflow-hidden'>
					<article class='article'>
						<h2 id='item-1'>Introduction</h2>
						<p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.</p>
						<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website
							Standard Terms and Conditions.</p>
						<pre class="m-0"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-primary<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Primary<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-secondary<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Secondary<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-success<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Success<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-danger<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Danger<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-warning<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Warning<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-info<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Info<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-light<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Light<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>badge text-bg-dark<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>Dark<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span></code></pre>
						<p>Minors or people below 18 years old are not allowed to use this Website.</p>
						<h2 id='item-2'>Intellectual Property Rights</h2>
						<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
						<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
						<h2 id='item-4'>Your Content</h2>
						<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
							irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
						<p>Your Content must be your own and must not be invading any rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>
						<h2 id='item-5'>No warranties</h2>
						<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
							interpreted as advising you.</p>
						<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
						<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
					</article>
				</div>
			</div>
    	</section>
		`
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
		content: `
		<section class='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
			<div class='row'>
				<div class='col-lg-3'>
					<ul class='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-1'>
								Abstract
							</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-3'>Restrictions</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-4'>Your Content</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-5'>No warranties</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
						</li>
					</ul>
				</div>
				<div class='col-lg'>
					<article class='article'>
						<h2 id='item-1'>Abstract</h2>
						<p>A human disc jockey can be very good at figuring out what similar music sounds like and playing songs at just the right sequence. However, this can prove to be a difficult task for an automated music streaming platform. A number of studies have been done on music play sequence in an attempt to learn out how and why Last.fm users include songs in their playlists and how similar tracks in one playlist are [1]. The abundance of data on listeners and the tracks they played make it very important for music streaming platforms to identify music that is both relevant and interesting to their users.</p>
						<p>The goal of this project is to use existing data about features of one million songs available through the Echo Nest API[2] as well as data on user preferences from Last.fm[3] to build a recommendation system that takes into account the features of individual songs. Echo Nest created the Million Song Dataset, a freely-available collection of audio features and metadata for a million contemporary popular music tracks, under a grant from the National Science Foundation to encourage research on algorithms that scale to commercial size. The audio features include timbre, loudness, energy, danceability, among others. Using these 
							one million songs, we demonstrate how we can leverage on the similarity between individual songs to create a content-based recommendation system.</p>
						<p>Choosing the right approach to model user profiles plays a big role in evaluating the quality of any recommendation system. To describe the relationship between users and songs, we first create a network of similar songs and run community detection algorithms to identify the dominant clusters that these songs belong to based on their similarity. In a human interpretation, these communities would represent the micro-genres that songs can be classified into. We will then use a subset of the Echo Nest data called the Taste Profiles to map users to these song clusters based on the songs that they already played on Last.fm.</p>
						<h2 id='item-2'>Intellectual Property Rights</h2>
						<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
						<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
						<h2 id='item-4'>Your Content</h2>
						<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
							irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
						<p>Your Content must be your own and must not be invading any rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>
						<h2 id='item-5'>No warranties</h2>
						<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
							interpreted as advising you.</p>
						<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
						<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
					</article>
				</div>
			</div>
    	</section>
		`
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
		contentType: 'blog',
		content: `
		<section class='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
			<div class='row'>
				<div class='col-lg-3'>
					<ul class='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-1'>
								Introduction
							</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-3'>Restrictions</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-4'>Your Content</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-5'>No warranties</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
						</li>
					</ul>
				</div>
				<div class='col-lg'>
					<article class='article'>
						<h2 id='item-1'>Introduction</h2>
						<p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.</p>
						<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website
							Standard Terms and Conditions.</p>
						<p>Minors or people below 18 years old are not allowed to use this Website.</p>
						<h2 id='item-2'>Intellectual Property Rights</h2>
						<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
						<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
						<h2 id='item-4'>Your Content</h2>
						<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
							irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
						<p>Your Content must be your own and must not be invading any rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>
						<h2 id='item-5'>No warranties</h2>
						<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
							interpreted as advising you.</p>
						<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
						<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
					</article>
				</div>
			</div>
    	</section>
		`
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
		contentType: 'blog',
		content: `
		<section class='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
			<div class='row'>
				<div class='col-lg-3'>
					<ul class='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-1'>
								Introduction
							</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-3'>Restrictions</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-4'>Your Content</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-5'>No warranties</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
						</li>
					</ul>
				</div>
				<div class='col-lg'>
					<article class='article'>
						<h2 id='item-1'>Introduction</h2>
						<p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.</p>
						<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website
							Standard Terms and Conditions.</p>
						<p>Minors or people below 18 years old are not allowed to use this Website.</p>
						<h2 id='item-2'>Intellectual Property Rights</h2>
						<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
						<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
						<h2 id='item-4'>Your Content</h2>
						<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
							irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
						<p>Your Content must be your own and must not be invading any rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>
						<h2 id='item-5'>No warranties</h2>
						<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
							interpreted as advising you.</p>
						<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
						<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
					</article>
				</div>
			</div>
    	</section>
		`
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
		contentType: 'blog',
		content: `
		<section class='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
			<div class='row'>
				<div class='col-lg-3'>
					<ul class='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-1'>
								Introduction
							</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-2'>Intellectual Property Rights</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-3'>Restrictions</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-4'>Your Content</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-5'>No warranties</a>
						</li>
						<li class='nav-item'>
							<a class='nav-link px-0' href='#item-6'>Governing Law & Jurisdiction</a>
						</li>
					</ul>
				</div>
				<div class='col-lg'>
					<article class='article'>
						<h2 id='item-1'>Introduction</h2>
						<p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.</p>
						<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website
							Standard Terms and Conditions.</p>
						<p>Minors or people below 18 years old are not allowed to use this Website.</p>
						<h2 id='item-2'>Intellectual Property Rights</h2>
						<p>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
						<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
						<h2 id='item-4'>Your Content</h2>
						<p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Company Name a non-exclusive, worldwide
							irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
						<p>Your Content must be your own and must not be invading any rights. Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>
						<h2 id='item-5'>No warranties</h2>
						<p>This Website is provided “as is,” with all faults, and Company Name express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be
							interpreted as advising you.</p>
						<h2 id='item-6'>Governing Law &amp; Jurisdiction</h2>
						<p>These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.</p>
					</article>
				</div>
			</div>
    	</section>
		`
	},
];

export default AllProjectsData;