// import node module libraries
import { Fragment } from 'react';
import { InputGroup, Form } from 'react-bootstrap';

// import sub components
import QuickMenu from 'layouts/navbars/QuickMenu';

const NavbarTop = (props) => {
	return (
        <Fragment>
			<Form className="flex-none">
				<InputGroup
					className="input-group input-group-sm input-group-inline w-rem-64 rounded-pill">
					<InputGroup.Text className="input-group-text rounded-start-pill">
						<i className="bi bi-search me-2"></i>
					</InputGroup.Text>
					<Form.Control
						type="search"
						className="form-control ps-0 rounded-end-pill"
						placeholder="Search Projects..."
					/>
				</InputGroup>
			</Form>
			<div className="d-flex align-items-center gap-4 px-4 scrollable-x">
				<div className="d-flex gap-2 text-xs">
					<span className="text-heading fw-semibold">Last updated:</span> <span className="text-muted">June 24th, 2023</span>
				</div>
			</div>
			<div className="hstack flex-fill justify-content-end flex-nowrap gap-6 ms-auto px-6 px-xxl-8">
				<QuickMenu/>
			</div>
		</Fragment>
    );
};

export default NavbarTop;
