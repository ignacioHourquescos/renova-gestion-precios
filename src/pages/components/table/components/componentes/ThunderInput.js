import React from "react";
import { Button, InputNumber } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const ThunderInput = ({
	onClick, // Generic click handler
	value, // Generic value for the input
	onChange, // Generic change handler for the input
}) => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<Button
				icon={<ThunderboltOutlined />} // Fixed icon
				onClick={onClick} // Use the passed onClick handler
				type="primary" // Fixed button type
			/>
			<InputNumber
				style={{
					marginLeft: 8,
					width: "70%",
				}}
				value={value} // Use the passed value
				onChange={onChange} // Use the passed onChange handler
				suffix="%"
				className="percentaje"
			/>
		</div>
	);
};

export default ThunderInput;
