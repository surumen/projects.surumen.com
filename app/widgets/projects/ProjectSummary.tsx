// import node module libraries
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import * as JSOG from 'jsog';
import { Col, Row } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';


import { Bracket, BracketGame, BracketGenerator } from '@/brackets';

import { WorldCup2018 } from '@/data/WorldCup2018';
import { SemiFinal1, SemiFinal2 } from '@/data/world-cup-18/sf';


const ProjectSummary = ({ item }) => {

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

	return (
		<Fragment>
			<section className='container mw-screen-xl border-bottom py-5'>
				<div className='row mb-3'>
					<div className='col col-md-4'>
						<div className='vstack gap-6 pointer-event'>
							<h1 className='ls-tight fw-bolder'>{item.title}</h1>
							<div className='d-flex gap-4 flex-wrap'>
								{item.technologyAreas.map((category, index) => {
									return (
										<span key={index} className='bg-primary-light border rounded px-3 py-1 fw-semibold text-primary border-primary-200 text-xs rounded-pill'>{category}</span>
									)
								})
								}
							</div>
						</div>
					</div>

					<div className='col col-md-6'>
						<div className='vstack gap-4'>
							<p className='text-muted text-xs text-uppercase'>Project Description</p>
							<p className='article'>
							<span
								dangerouslySetInnerHTML={{
									__html: item.description
								}}
							></span>
							</p>
						</div>
					</div>

					<div className='col col-md-2'>
						<div className='vstack gap-6'>
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
					</div>

				</div>
			</section>

			<section className='container mw-screen-xl border-bottom py-5'>
				{item.contentType === 'blog' ? (
					<Row className='pt-4'>
						<Col md={3}>
							<ul className='nav flex-column mt-lg-6 position-lg-sticky top-lg-6'>
								<li className='nav-item'>
									<a className='nav-link px-0' href='#introduction'>
										Introduction
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link px-0' href='#introduction'>
										Introduction
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link px-0' href='#introduction'>
										Introduction
									</a>
								</li>
							</ul>
						</Col>
						<Col md={9}>
							<article className='article'>
								<Markdown
									remarkPlugins={[remarkGfm]}
									components={{
										h1: 'h2',
										h2(props) {
											const {node, ...rest} = props;
											const headerName = props.children ? props.children.toLocaleString() : '';
											return <h2 className='border-bottom'
												id={headerName.replace(/ /g,'-').toLowerCase()}
											>{props.children}</h2>
										}
									}}
								>{item.content}</Markdown>
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
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
