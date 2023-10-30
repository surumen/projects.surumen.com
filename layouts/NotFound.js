// import node module libraries
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';

// import layouts

const NotFound = (props) => {
	useEffect(() => {
		document.body.className = 'bg-white';
	});

	return (
		<main>
			<section id="db-wrapper" className="bg-white">
				<Container className="d-flex flex-column">
					{props.children}
				</Container>
			</section>
		</main>
	);
};

export default NotFound;
