// import node module libraries
import { Card, ListGroup } from 'react-bootstrap';

const ProjectDescription = ({ project }) => {
	return (
		<Card>
			<Card.Body>
				<div className="mb-4">
					<h4 className="mb-2">{project.title}</h4>
					<p>
						{project.shortdescription}
					</p>
				</div>
			</Card.Body>
		</Card>
	);
};
export default ProjectDescription;
