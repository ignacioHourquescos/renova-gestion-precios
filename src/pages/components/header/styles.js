import styled from "styled-components";

export const Title = styled.h2`
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
`;

export const Container = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 16;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
	// Optional: Add some padding and rounded corners for better appearance
	padding: 16px 16px;
	align-items: center;
	margin-bottom: 1rem;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
`;
