// import node module libraries
import React, { Fragment, useState } from "react";
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
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
		console.log('Clicked team: ', teamId);
		console.log('Clicked game: ', gameId);
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

	// @ts-ignore
	return (
		<Fragment>
			<section className='container mw-screen-xl border-bottom mx-n6 pb-6 pt-4 ps-6 pe-0'>
				<div className='row mb-3'>
					<div className='col col-md-4'>
						<div className='vstack gap-6 pointer-event'>
							<h1 className='ls-tight fw-bolder'>{item.title}</h1>
							<div className='d-flex gap-4 flex-wrap'>
								{item.categories.map((category, index) => {
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

			{item.contentType === 'blog' ? (
				<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.content)}}></div>
			) : (
				<section className='container mw-screen-xl mx-n6 my-6 pt-2 pb-6 ps-6 pe-0'>
					<Row>
						<Col>
							<Bracket
								game={tournament}
								homeOnTop={true}
								GameComponent={gameComponent}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<BracketGenerator games={semiFinal} />
						</Col>
					</Row>
				</section>
			)}

		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
