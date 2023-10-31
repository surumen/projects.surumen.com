// import node module libraries
import React, { Fragment } from "react";
import { Card, Row, Col, Image, Button } from "react-bootstrap";
import Link from 'next/link';
import PropTypes from 'prop-types';

const ProjectSummary = ({ item }) => {

	const CategoryColors = (category) => {
		switch (category) {
			case 'Courses':
				return 'success';
			case 'Tutorial':
				return 'primary';
			case 'Workshop':
				return 'warning';
			case 'Company':
				return 'info';
			default:
				return 'primary';
		}
	};

	return (
		<Fragment>
			<Row>
				<Col>
					<div className='article'>
						<span
							dangerouslySetInnerHTML={{
								__html: item.description
							}}
						></span>
					</div>
				</Col>
			</Row>
		</Fragment>
	);

};

// Typechecking With PropTypes
ProjectSummary.propTypes = {
	item: PropTypes.object.isRequired
};

export default ProjectSummary;
