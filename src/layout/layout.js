import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;
const items = new Array(1).fill(null).map((_, index) => ({
	key: 1,
	label: `Gestion de precios`,
}));

const LayoutCustom = ({ children }) => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	return (
		<Layout
			style={{
				backgroundColor: "blue !important",
			}}
		>
			<Content
				style={{
					padding: "0px",
				}}
			>
				<Breadcrumb
					style={{
						margin: "16px 0",
					}}
				></Breadcrumb>
				<div
					style={{
						background: colorBgContainer,
						minHeight: 260,

						borderRadius: borderRadiusLG,
					}}
				>
					{children}
				</div>
			</Content>
		</Layout>
	);
};
export default LayoutCustom;
