// import node module libraries
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import * as JSOG from 'jsog';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';


import { Bracket, BracketGame } from '@/brackets';
import MarkdownDisplay from './Markdown';

import { WorldCup2018 } from '@/data/WorldCup2018';
import { SemiFinal1, SemiFinal2 } from '@/data/world-cup-18/sf';


const ProjectSummary = ({ project }) => {

	const [hoveredTeamId, setHoveredTeamId] = useState(null);

	const tournament = JSOG.decode(WorldCup2018);

	const semiFinal = JSOG.decode([SemiFinal1, SemiFinal2]);

	const onHoveredTeamChange = (hoveredTeamId) => {
		setHoveredTeamId(hoveredTeamId);
	};

	const handleClick = (teamId, gameId) => {

	};

	const gameComponent = (props) => {
		return (
			<BracketGame
				{...props}
				onHoveredTeamIdChange={onHoveredTeamChange}
				onClickTeam={handleClick}
				hoveredTeamId={hoveredTeamId}
			/>
		);
	}

	const navContent: any = [];
	if (project.content && project.contentType === 'blog') {
		const headings: string[] = Array.from(project.content.match(/#{1,2}.+/g));
		headings.forEach(header => {
			const numHashes = (header.match(/#/g) || []).length;
			if (numHashes > 0 && numHashes < 3) {
				navContent.push(header.replace(/#/g,'').trim());
			}
		});
	}

	return (
		<Fragment>
			<section className='container mw-screen-xl border-bottom py-5'>
				<Row className='mb-3'>
					<Col sm={12} md={4}>
						<div className='vstack gap-6 pointer-event mb-5 mb-md-0'>
							<h1 className='ls-tight fw-bolder'>{project.title}</h1>
							<div className='d-flex gap-4 flex-wrap'>
								{project.technologyAreas.map((category, index) => {
									return (
										<span key={index} className='bg-primary-light border rounded px-3 py-1 fw-semibold text-primary border-primary-200 text-xs rounded-pill'>{category}</span>
									)
								})
								}
							</div>
						</div>
					</Col>

					<Col sm={12} md={6}>
						<div className='vstack gap-4 mb-5 mb-md-0'>
							<p className='text-muted text-xs text-uppercase'>Project Description</p>
							<p className='article'>
							<span
								dangerouslySetInnerHTML={{
									__html: project.description
								}}
							></span>
							</p>
						</div>
					</Col>

					<Col sm={12} md={2}>
						<div className='vstack gap-6 mb-5 mb-md-0'>
							<div>
								<p className='text-muted text-xs text-uppercase mb-2'>Completed</p>
								<p className='article text-sm'>2022</p>
							</div>
							<div>
								<p className='text-muted text-xs text-uppercase mb-2'>Collaborators</p>
								<p className='article text-sm'>Individual Project</p>
							</div>
							<div>
							<span role='button' className='btn btn-sm bg-primary-600 text-bg-primary shadow-none rounded-pill'>
								<span className='me-2'>View Live</span>
								<SendFill size={12} className='mb-1' />
							</span>
							</div>
						</div>
					</Col>

				</Row>
			</section>

			<section className='container mw-screen-xl border-bottom py-5'>
				{project.contentType === 'blog' ? (
					<Row className='pt-4'>
						<Col md={3}>
							<ul className='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
								{navContent.map((navigation, index) => {
									return (
										<li key={index} className='nav-item'>
											<a className='nav-link px-0' href={`#${navigation.replace(/ /g,'-').toLowerCase()}`}>
												{navigation}
											</a>
										</li>
									);
								})}
							</ul>
						</Col>
						<Col md={9}>
							<article className='article'>
								<MarkdownDisplay content={project.content} />
							</article>
						</Col>
					</Row>
				) : (
					<div>
						<Row>
							<Col>
								<Bracket
									game={tournament}
									homeOnTop={true}
									GameComponent={gameComponent}
								/>
							</Col>
						</Row>
					</div>
				)}
			</section>

		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	project: PropTypes.object.isRequired
};

export default ProjectSummary;
