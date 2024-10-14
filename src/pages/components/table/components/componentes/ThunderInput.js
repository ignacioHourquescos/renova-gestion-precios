import React from "react";
import { Button, InputNumber } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const ThunderInput = ({
	onClick, // Generic click handler
	value, // Generic value for the input
	onChange,
	disabled, // Generic change handler for the input
}) => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<InputNumber
				style={{
					width: "100%",
				}}
				value={value} // Use the passed value
				onChange={onChange} // Use the passed onChange handler
				suffix="%"
				className="percentaje"
				disabled={disabled}
			/>
		</div>
	);
};

export default ThunderInput;
