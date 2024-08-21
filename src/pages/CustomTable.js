import React from "react";
import { Table, InputNumber, Spin } from "antd"; // Importar Spin
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { variationFormatter, formatearNumero } from "../utils.js"; // Importar funciones

const CustomTable = ({
	data,
	newMargins,
	newPrices,
	handleNewMarginChange,
	showWithIVA,
	loading,
	setNewMargins,
}) => {
	// Agregar loading y setNewMargins como props
	const columns = [
		{
			title: "Article ID",
			dataIndex: "articleId",
			key: "articleId",
			width: "10%",
			fixed: "left",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: "15%",
			ellipsis: true,
			fixed: "left",
		},
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>COSTO NETO</h3>,
			children: [
				{
					title: "Costo RP",
					dataIndex: "netCost",
					key: "netCost",
					align: "right",
					width: "5%",
					render: (text, record) =>
						showWithIVA
							? formatearNumero(record.netCost * 1.21)
							: formatearNumero(record.netCost),
				},
				{
					title: "Cuesto NUEVO",
					dataIndex: "importedNetCost",
					key: "importedNetCost",
					align: "right",
					width: "5%",
					render: (text) =>
						loading ? ( // Usar loading aquí
							<Spin size="small" />
						) : text !== null ? (
							showWithIVA ? (
								formatearNumero(text * 1.21)
							) : (
								formatearNumero(text)
							)
						) : (
							"-"
						),
				},
				{
					title: "Variación",
					dataIndex: "variation",
					key: "variation",
					align: "right",
					width: "3%",
					render: (_, record) => {
						const { importedNetCost, netCost, grossCost } = record;
						if (importedNetCost === null || netCost === null) return "-";
						const value = importedNetCost / grossCost;
						const percentage = ((value - 1) * 100).toFixed(2);
						if (percentage === 0)
							return <span style={{ color: "gray" }}>0</span>;
						return (
							<span style={{ color: value > 1 ? "green" : "red" }}>
								{value > 1 ? <UpOutlined /> : <DownOutlined />}
								{Math.abs(percentage)}%
							</span>
						);
					},
				},
			],
		},
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA NORMAL</h3>,
			children: [
				{
					title: "Ganancia",
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "5%",
					render: (value, record) => {
						const initialMargin = record.prices[0]?.margin;
						if (!(record.articleId in newMargins)) {
							setNewMargins((prev) => ({
								...prev,
								[record.articleId]: initialMargin,
							}));
						}
						return (
							<InputNumber
								type="number"
								placeholder="test"
								value={newMargins[record.articleId] || initialMargin}
								onChange={(value) => handleNewMarginChange(value, record)}
								style={{ width: "100%" }}
							/>
						);
					},
				},
				{
					title: "NUEVO PRECIO",
					dataIndex: "newPrice",
					key: "newPrice",
					align: "right",
					width: "5%",
					render: (_, record) => {
						const newPrice =
							newPrices[record.articleId] ||
							record.importedNetCost *
								(1 +
									(newMargins[record.articleId] || record.prices[0]?.margin) /
										100);
						return (
							<span>
								{showWithIVA
									? formatearNumero(newPrice * 1.21)
									: formatearNumero(newPrice) || "N/A"}
							</span>
						);
					},
				},
				{
					title: "Variación",
					dataIndex: "newVariation",
					key: "newVariation",
					align: "right",
					width: "5%",
					render: (_, record) => {
						const newPrice =
							newPrices[record.articleId] ||
							record.importedNetCost *
								(1 +
									(newMargins[record.articleId] || record.prices[0]?.margin) /
										100);
						const netPrice = record.prices[0]?.netPrice || 1;
						const value = newPrice / netPrice;
						const percentage = ((value - 1) * 100).toFixed(2);
						return variationFormatter(value, percentage);
					},
				},
			],
		},
	];

	return (
		<Table
			bordered
			columns={columns}
			dataSource={data}
			rowKey="articleId"
			pagination={{ pageSize: 200 }}
		/>
	);
};

export default CustomTable;
