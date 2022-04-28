import React from 'react';

const Subtitle = ({ children }) => {
	return (
		<>
		<h2 className='subtitle'>
			{children}
		</h2>
		<style jsx>{`
			.subtitle {
				text-transform: uppercase;
				font-size: 16px;
				font-weight: bold;
				color: #2d0612;
				width: 100%;
			}
		`}</style>
		</>
	);
};

export default Subtitle;